import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (exists) {
      throw new ConflictException('username ou email já cadastrado');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashed,
      role: 'CLIENT',
    });
    const saved = await this.usersRepository.save(user);
    const { password: _, ...safe } = saved;
    return safe; // sem password na resposta
  }

  async login(username: string, pass: string) {
    const user = await this.validateUser(username, pass);
    
    // Adicione esta verificação para evitar o erro se o utilizador for null
    if (!user) {
      throw new UnauthorizedException('Utilizador ou password inválidos');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }
    const { password, ...result } = user;
    return result;
  }

  async validateUser(username: string, pass: string): Promise<any> {
  const user = await this.usersRepository.findOne({ where: { username } });
  if (user && (await bcrypt.compare(pass, user.password))) { // Nota: Em produção, utilize bcrypt para comparar passwords
    const { password, ...result } = user;
    return result;
  }
  return null;
}
}