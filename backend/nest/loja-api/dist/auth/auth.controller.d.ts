import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
    }>;
    getAdminDashboard(req: any): {
        message: string;
        user: any;
    };
}
