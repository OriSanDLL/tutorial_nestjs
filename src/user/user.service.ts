
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkPermission } from 'src/helpers/checkPermission.helper';
import { RegisterUserDto } from 'src/user/dtos/register.dto';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    //CRUD
    async create(requestBody: RegisterUserDto){
        const newUser = this.userRepository.create(requestBody);

        return this.userRepository.save(newUser);
    };

    findAll(){
        return this.userRepository.find();
    };
    
    findByEmail(email: string){
        return this.userRepository.findOneBy({email});
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({id});

        if(!user){
            throw new NotFoundException('User không tồn tại!');
        }

        return user;
    }

    async upDateUserById(id: number, requestBody: UpdateUserDto, currentUser: User){

        if (requestBody.role){
            throw new BadRequestException("You cannot change role")
        }

        let user = await this.findById(id);

        if(!user){
            throw new NotFoundException('User không tồn tại!');
        }

        // logic
        // id:1 chỉ có quyền update của chính nó
        // id:1 !== update id: 2
        checkPermission.check(id, currentUser);

        if (requestBody.password) {
            const hashedPassword = await bcrypt.hash(requestBody.password, 10);
            requestBody.password = hashedPassword;
        }

        user = { ...user, ...requestBody };

        const updateUser = await this.userRepository.save(user);

        return {
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            email: updateUser.email,
        };
    }

    async deleteUserById(id: number, currentUser: User){
        const user = await this.findById(id);

        checkPermission.check(id, currentUser);

        if(!user){
            throw new NotFoundException('User không tồn tại!');
        }
        
        return this.userRepository.remove(user);
    }
}
