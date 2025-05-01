import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'; // Pour comparer les mots de passe

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
  
    const payload = { sub: user.id, email: user.email, role: user.role };
  
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
  
    // Sauvegarder le refresh token dans la base
    await this.usersService.updateRefreshToken(user.id, refreshToken);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }


  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken, { secret: 'to-do-list' });
  
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
  
      // Optionnel: vérifier que le refreshToken est celui stocké dans l'utilisateur
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token invalide');
      }
  
      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }, { expiresIn: '1h' });
  
      return {
        access_token: newAccessToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }
  
}  