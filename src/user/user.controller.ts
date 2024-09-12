import { UserService } from './user.service';
import { Controller , Get , Post , Put , Delete , Body, Param , ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards} from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { RegisterUserDto } from 'src/user/dtos/register.dto';
import { AuthService } from 'src/user/auth.service';
import { LoginUserDto } from 'src/user/dtos/loginUser.dto';
import { CurrentUser } from 'src/user/decorators/user.decorators';
import { User } from 'src/user/user.entity';

@Controller('/api/v1/users/')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)

export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService){}

    // request -> middleware -> guard -> interceptor -> response
    @Get()
    @UseGuards(AuthGuard)
    getAllUser(){
        console.log('Second interceptor');
        return this.userService.findAll();
    }
    @Get('/current-user')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() currentUser: User){
        return currentUser;
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number){
        return this.userService.findById(id);
    }

    @Put(':id')
    upDateUserById(
        @Param('id', ParseIntPipe) id: number, 
        @Body() requetsBody: UpdateUserDto){
        return this.userService.upDateUserById(id, requetsBody);
    }

    @Delete(':id')
    deleteUserById(@Param('id', ParseIntPipe) id: number){
        return this.userService.deleteUserById(id);
    }

    // Register
    @Post("register")
    registerUser(@Body() requestBody: RegisterUserDto){
        return this.authService.register(requestBody);
    }

    @Post("login")
    loginUser(@Body() requestBody: LoginUserDto){
        console.log("second interceptor");
        return this.authService.login(requestBody);
    }

}
