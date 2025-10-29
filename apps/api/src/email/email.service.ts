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

    async sendOrderConfirmation(
        email: string,
        userId: string,
        planId: string,
        amount: number,
        currency: string,
    ) {
        try {
            // Convert amount from cents to euros
            const amountInEuros = (amount / 100).toFixed(2);

            // Get plan name based on planId
            const planName = this.getPlanName(planId);

            const result = await this.resend.emails.send({
                from: 'Petra Coaching <noreply@coachingpetra.com>',
                to: email,
                subject: '🎉 Ordine Confermato - Benvenuta nel tuo percorso di coaching!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2D3748; margin-bottom: 10px;">🎉 Ordine Confermato!</h1>
                            <p style="color: #718096; font-size: 18px;">Grazie per aver scelto Petra Coaching</p>
                        </div>
                        
                        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h2 style="color: #2D3748; margin-bottom: 15px;">Dettagli del tuo ordine</h2>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="font-weight: bold;">Piano:</span>
                                <span>${planName}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="font-weight: bold;">Importo:</span>
                                <span>€${amountInEuros} ${currency.toUpperCase()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="font-weight: bold;">ID Ordine:</span>
                                <span>${userId}</span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #2D3748; margin-bottom: 15px;">Cosa succede ora?</h2>
                            <ul style="color: #4A5568; line-height: 1.6;">
                                <li>📧 Riceverai le tue credenziali di accesso via email entro 24 ore</li>
                                <li>📱 Potrai accedere alla piattaforma e iniziare il tuo percorso</li>
                                <li>💬 Il tuo coach personale ti contatterà per il primo colloquio</li>
                                <li>📋 Riceverai il tuo piano di allenamento personalizzato</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #E6FFFA; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="color: #2D3748; margin-bottom: 10px;">🔒 Pagamento Sicuro</h3>
                            <p style="color: #4A5568; margin: 0;">Il tuo pagamento è stato processato in modo sicuro tramite Stripe. Riceverai la fattura via email separatamente.</p>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="color: #718096;">Hai domande? Contattaci a <a href="mailto:support@coachingpetra.com" style="color: #3182CE;">support@coachingpetra.com</a></p>
                        </div>
                        
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                            <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                                Petra Coaching - Il tuo percorso verso il benessere inizia qui
                            </p>
                        </div>
                    </div>
                `
            });

            console.log('✅ Order confirmation email sent to:', email);
            return result;
        } catch (error: any) {
            console.error('❌ Failed to send order confirmation email:', error.message || error);
            throw new Error(`Failed to send order confirmation email: ${error.message || 'Unknown error'}`);
        }
    }

    private getPlanName(planId: string): string {
        const planNames: { [key: string]: string } = {
            'starter-plan': 'Piano Starter',
            'premium-plan': 'Piano Premium',
            'coaching-donna-starter': 'Coaching Donna - Starter',
            'coaching-donna-premium': 'Coaching Donna - Premium',
        };

        return planNames[planId] || planId;
    }


}