import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoggerMiddleware } from 'src/user/middlewares/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/user/auth.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
    ],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [UserService, AuthService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
