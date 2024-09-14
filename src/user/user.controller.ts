import { UserService } from './user.service';
import { Controller , Get , Post , Put , Delete , Body, Param , ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards} from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegisterUserDto } from 'src/user/dtos/register.dto';
import { AuthService } from 'src/user/auth.service';
import { LoginUserDto } from 'src/user/dtos/loginUser.dto';
import { CurrentUser } from 'src/decorators/user.decorators';
import { User } from 'src/user/user.entity';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('/api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)

export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService){}

    // request -> middleware -> guard -> interceptor -> response
    @Get()
    @UseGuards(new RoleGuard(['user', 'admin']))
    @UseGuards(AuthGuard)
    getAllUser(){

        return this.userService.findAll();
    }
    @Get('/current-user')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() currentUser: User){
        return currentUser;
    }

    @Get('/:id')
    getUserById(@Param('id', ParseIntPipe) id: number){
        return this.userService.findById(id);
    }

    @Put('/:id')
    @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
    @UseGuards(AuthGuard)
    upDateUserById(
        @Param('id', ParseIntPipe) id: number, 
        @Body() requetsBody: UpdateUserDto,
        @CurrentUser() currentUser: User){
        return this.userService.upDateUserById(id, requetsBody , currentUser);
    }

    @Delete('/:id')
    @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
    @UseGuards(AuthGuard)
    deleteUserById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: User){
        return this.userService.deleteUserById(id, currentUser);
    }

    // Register
    @Post("/register")
    registerUser(@Body() requestBody: RegisterUserDto){
        return this.authService.register(requestBody);
    }

    @Post("/login")
    loginUser(@Body() requestBody: LoginUserDto){
        return this.authService.login(requestBody);
    }

}
