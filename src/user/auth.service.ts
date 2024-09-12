import { BadRequestException, Injectable  } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "src/user/dtos/register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "src/user/dtos/loginUser.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService){}

    async register(requestBody: RegisterUserDto){
        // check email is exist?
        const userByEmail = await this.userService.findByEmail(requestBody.email);
        if(userByEmail){
            throw new BadRequestException('Email already exists!');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(requestBody.password,10);
        requestBody.password = hashedPassword;

        // save to database
        const saveUser = await this.userService.create(requestBody);

        // generate jwt token
        const payload = {
            id: saveUser.id,
            email: saveUser.email,
            firstName: saveUser.firstName,
            lastName: saveUser.lastName,
            role: saveUser.role,
        }
        const access_Token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        });

        return {
            msg: 'Register successfully!',
            access_Token,
        }
    }

    async login(requestBody: LoginUserDto){
        // check email is exist?
        const userByEmail = await this.userService.findByEmail(requestBody.email);

        if(!userByEmail){
            throw new BadRequestException('Email does not exist!');
        }

        // check password
        const isMatchPassword = await bcrypt.compare(
            requestBody.password, 
            userByEmail.password
        );

        if(!isMatchPassword){
            throw new BadRequestException('Wrong password!');
        }

        // generate jwt token
        const payload = {
            id: userByEmail.id,
            email: userByEmail.email,
            firstName: userByEmail.firstName,
            lastName: userByEmail.lastName,
            role: userByEmail.role,
        }
        const access_Token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        });

        return {
            msg: 'Login successfully!',
            access_Token,
        }
    }
}