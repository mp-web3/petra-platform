import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY')

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not defined')
        }
        this.resend = new Resend(apiKey);
    }

    getResendClient(): Resend {
        return this.resend;
    }

    async sendTestEmail(
        name: string
    ) {
        try {
            const result = await this.resend.emails.send({
                from: 'Petra <test@coachingpetra.com>',
                to: 'Mattia Papa <mp.web3@gmail.com>',
                subject: '🎉 Test Email da Petra Coaching',
                html: `<h1>Ciao ${name}!</h1><p>Questo è un test.</p>`
            });

            // Email sent successfully - check Resend dashboard for details
            return result;
        } catch (error: any) {
            console.error('❌ Email sending failed:', error.message || error);
            throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
        }
    }


}