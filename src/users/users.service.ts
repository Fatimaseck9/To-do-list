import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    // Création d'un utilisateur
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Vérifier si l'email existe déjà mais sans lancer d'exception
        const existingUser = await this.usersRepository.findOne({ 
            where: { email: createUserDto.email } 
        });
        
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            email: createUserDto.email,
            password: hashedPassword,
            role: createUserDto.role,
        });
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    // Recherche utilisateur par email
    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }


    // Recherche utilisateur par ID
    async findById(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    
    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await this.usersRepository.update(userId, { refreshToken });
      }
      
}