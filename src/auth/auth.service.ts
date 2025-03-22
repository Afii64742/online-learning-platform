import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modals/User.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/modals/User.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}


    async register(email: string, password: string, role: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
         // Validate and Convert Role
    const userRole = Object.values(UserRole).includes(role as UserRole) 
    ? (role as UserRole) 
    : UserRole.STUDENT; // Default to STUDENT if invalid
        const user = this.userRepository.create({ email, password: hashedPassword, role:userRole  });
        await this.userRepository.save(user);
        return {message: 'User created successfully', user};
    }


    async login(email:string, password:string){
        const user = await this.userRepository.findOne({where:{email}});
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if(!passwordValid){
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {sub:user.id,email:user.email, role:user.role};
        const accessToken = this.jwtService.sign(payload);
        return {accessToken}
    }
}
