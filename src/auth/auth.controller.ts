import { Body, Controller, Get, Post, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/modals/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Post('register')
    async register(@Body() body) {
        return this.authService.register(body.email, body.password, body.role);
    }

    @Post('login')
    async login(@Body() body) {
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.userRepository.findOne({
            where: { id: req.user.sub }, // Fetch user by ID from JWT payload
            select: ['id', 'email', 'role'], // Exclude password for security
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user; // Return full user details
    }
}
