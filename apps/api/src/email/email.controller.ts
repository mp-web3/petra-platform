import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService
    ) { }

    @Post('test')
    async sendTestEmail(@Body() body: { name: string }) {
        try {
            const result = await this.emailService.sendTestEmail(body.name);

            if (result.error) {
                return {
                    success: false,
                    message: 'Failed to send test email',
                    error: result.error.message || 'Unknown error',
                };
            }

            return {
                success: true,
                message: 'Test email sent successfully',
                emailId: result.data?.id || 'unknown',
            };
        } catch (error: any) {
            console.error('❌ Email controller error:', error.message || error);
            return {
                success: false,
                message: error.message || 'Failed to send test email',
                error: error.message,
            };
        }
    }

    @Get('status')
    async getEmailStatus() {
        return {
            status: 'healthy',
            service: 'EmailService',
            provider: 'Resend',
        };
    }
} 