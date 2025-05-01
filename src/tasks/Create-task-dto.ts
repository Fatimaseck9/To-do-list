import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    completed?: boolean;

    @IsNotEmpty()
    userId: number; 
}
