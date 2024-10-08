import { IsEmail, IsNotEmpty } from "class-validator";
import { ROLES } from "src/user/user.entity";

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    password: string;

    role: ROLES;
}