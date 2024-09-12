import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/user/dtos/register.dto';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    //CRUD
    async create(requetsBody: RegisterUserDto){
        const newUser = this.userRepository.create(requetsBody);

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

    async upDateUserById(id: number, requetsBody: UpdateUserDto){
        let user = await this.findById(id);

        if(!user){
            throw new NotFoundException('User không tồn tại!');
        }

        user = { ...user, ...requetsBody };
        return this.userRepository.save(user);
    }

    async deleteUserById(id: number){
        const user = await this.findById(id);

        if(!user){
            throw new NotFoundException('User không tồn tại!');
        }
        
        return this.userRepository.remove(user);
    }
}
