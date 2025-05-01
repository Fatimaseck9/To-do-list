import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../users.entity'; 

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
