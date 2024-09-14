import { BadRequestException } from "@nestjs/common";
import { User } from "src/user/user.entity";

export class checkPermission{
    static check(id: number, currentUser: User){
        if(id === currentUser.id){
            return;
        }

        if(currentUser.role === 'ADMIN'){}

        throw new BadRequestException('User can not perform action')
    }
}