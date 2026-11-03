import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(username: string, email: string, password: string): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
    }>;
    login(username: string, pass: string): Promise<{
        access_token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
    }>;
    validateUser(username: string, pass: string): Promise<any>;
}
