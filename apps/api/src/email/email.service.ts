import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
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
        orderId: string,
        planId: string,
        amount: number,
        currency: string,
    ) {
        // Create email log entry first (will be updated after sending)
        let emailLog = await this.prisma.emailLog.create({
            data: {
                emailType: 'TRANSACTIONAL',
                orderId: orderId,
                recipientEmail: email,
                status: 'SENT', // Will be updated if it fails
                sentAt: new Date(),
            }
        });

        try {
            // Convert amount from cents to euros
            const amountInEuros = (amount / 100).toFixed(2);

            // Get plan name based on planId
            const planName = this.getPlanName(planId);

            const result = await this.resend.emails.send({
                from: 'Petra Coaching <noreply@coachingpetra.com>',
                to: email,
                subject: '🎉 Ordine Confermato - Grazie per aver scelto Petra Coaching',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2D3748; margin-bottom: 10px;">🎉 Ordine Confermato!</h1>
                            <p style="color: #718096; font-size: 18px;">Grazie per aver scelto Petra Coaching</p>
                        </div>
                        
                        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h2 style="color: #2D3748; margin-bottom: 15px;">Dettagli del tuo ordine</h2>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="font-weight: bold;">Piano: </span>
                                <span>${planName}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="font-weight: bold;">Importo: </span>
                                <span>€${amountInEuros} ${currency.toUpperCase()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="font-weight: bold;">ID Ordine: </span>
                                <span>${orderId}</span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #2D3748; margin-bottom: 15px;">Cosa succede ora?</h2>
                            <ul style="color: #4A5568; line-height: 1.6;">
                                <li>📧 Riceverai una mail per attivare il tuo account entro pochi minuti</li>
                                <li>📱 Dopo aver attivato il tuo account potrai prenotare la prima call con Petra!</li>
                                <li>💬 In seguito alla call la tua coach preparerà un piano personalizzato e ti darà accesso all'app</li>
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

            // Update email log with provider ID
            await this.prisma.emailLog.update({
                where: { id: emailLog.id },
                data: {
                    status: 'SENT',
                    providerId: (result.data?.id as string) || null,
                }
            });

            console.log('✅ Order confirmation email sent to:', email, 'Provider ID:', result.data?.id);
            return {
                success: true,
                providerId: result.data?.id,
                status: 'SENT',
                emailLogId: emailLog.id
            };
        } catch (error: any) {
            // Update email log with failure status
            await this.prisma.emailLog.update({
                where: { id: emailLog.id },
                data: {
                    status: 'FAILED',
                    errorMessage: error.message || 'Unknown error',
                }
            });

            console.error('❌ Failed to send order confirmation email:', error.message || error);

            // Return failure info instead of throwing (so webhook doesn't fail)
            return {
                success: false,
                providerId: null as string | null,
                status: 'FAILED' as const,
                errorMessage: error.message || 'Unknown error',
                emailLogId: emailLog.id
            };
        }
    }

    async sendAccountActivation(
        email: string,
        userId: string,
        activationToken: string,
        orderId?: string | null, // Optional - for future signups without orders
    ) {
        // Create email log entry first
        let emailLog = await this.prisma.emailLog.create({
            data: {
                emailType: 'SIGNUP',
                orderId: orderId || null, // Can be null if no order (e.g., direct signup)
                recipientEmail: email,
                status: 'SENT',
                sentAt: new Date(),
            }
        });

        try {
            // Include email in URL for better UX (pre-fills resend form if token expires)
            const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
            const activationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/activate?token=${activationToken}&userId=${userId}${emailParam}`;

            const result = await this.resend.emails.send({
                from: 'Petra Coaching <noreply@coachingpetra.com>',
                to: email,
                subject: '🎯 Attiva il tuo account Petra Coaching',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2D3748; margin-bottom: 10px;">🎯 Attiva il tuo account</h1>
                            <p style="color: #718096; font-size: 18px;">Completa la registrazione e inizia il tuo percorso</p>
                        </div>
                        
                        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <p style="color: #4A5568; line-height: 1.6;">
                                Clicca sul pulsante qui sotto per attivare il tuo account e impostare la tua password:
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${activationUrl}" style="background-color: #3182CE; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                    Attiva Account
                                </a>
                            </div>
                            
                            <p style="color: #718096; font-size: 14px; margin-top: 20px;">
                                Oppure copia e incolla questo link nel browser:<br>
                                <a href="${activationUrl}" style="color: #3182CE; word-break: break-all;">${activationUrl}</a>
                            </p>
                        </div>
                        
                        <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
                            <p style="color: #C53030; font-size: 14px; margin: 0;">
                                ⚠️ Questo link scade tra 24 ore per motivi di sicurezza.
                            </p>
                        </div>
                        
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                            <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                                Petra Coaching - Il tuo percorso verso il benessere inizia qui
                            </p>
                        </div>
                    </div>
                `
            });

            // Update email log with provider ID
            await this.prisma.emailLog.update({
                where: { id: emailLog.id },
                data: {
                    status: 'SENT',
                    providerId: (result.data?.id as string) || null,
                }
            });

            console.log('✅ Account activation email sent to:', email, 'Provider ID:', result.data?.id);
            return {
                success: true,
                providerId: result.data?.id,
                status: 'SENT',
                emailLogId: emailLog.id
            };
        } catch (error: any) {
            // Update email log with failure status
            await this.prisma.emailLog.update({
                where: { id: emailLog.id },
                data: {
                    status: 'FAILED',
                    errorMessage: error.message || 'Unknown error',
                }
            });

            console.error('❌ Failed to send account activation email:', error.message || error);

            return {
                success: false,
                providerId: null as string | null,
                status: 'FAILED' as const,
                errorMessage: error.message || 'Unknown error',
                emailLogId: emailLog.id
            };
        }
    }

    /**
     * Sends admin notification email when a new order is placed
     * 
     * @param orderId - Order ID
     * @param customerEmail - Customer email address
     * @param customerName - Customer name (optional)
     * @param planId - Plan identifier
     * @param amount - Order amount in cents
     * @param currency - Currency code
     * @returns Result with success status and email log ID
     */
    async sendAdminOrderNotification(
        orderId: string,
        customerEmail: string,
        customerName: string | null,
        planId: string,
        amount: number,
        currency: string,
    ) {
        // Get admin emails from environment variable
        const adminEmailsStr = this.configService.get<string>('ADMIN_EMAILS');

        // Early return if no admin emails configured
        if (!adminEmailsStr || adminEmailsStr.trim() === '') {
            console.log('ℹ️  ADMIN_EMAILS not configured, skipping admin notification');
            return {
                success: false,
                errorMessage: 'ADMIN_EMAILS not configured',
                emailLogId: null as string | null,
            };
        }

        // Parse admin emails (comma-separated)
        const adminEmails = adminEmailsStr
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        if (adminEmails.length === 0) {
            console.log('ℹ️  No valid admin emails found, skipping admin notification');
            return {
                success: false,
                errorMessage: 'No valid admin emails found',
                emailLogId: null as string | null,
            };
        }

        // Create email log entry for each admin email
        const emailLogs = await Promise.all(
            adminEmails.map(email =>
                this.prisma.emailLog.create({
                    data: {
                        emailType: 'TRANSACTIONAL',
                        orderId: orderId,
                        recipientEmail: email,
                        status: 'SENT', // Will be updated if it fails
                        sentAt: new Date(),
                    }
                })
            )
        );

        try {
            // Convert amount from cents to euros
            const amountInEuros = (amount / 100).toFixed(2);

            // Get plan name based on planId
            const planName = this.getPlanName(planId);

            // Format customer name or use email
            const displayName = customerName || customerEmail;

            // Get frontend URL for admin dashboard link (optional)
            const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
            const adminDashboardUrl = `${frontendUrl}/dashboard`;

            // Send email to all admin addresses
            const result = await this.resend.emails.send({
                from: 'Petra Coaching <noreply@coachingpetra.com>',
                to: adminEmails, // Array of email addresses
                subject: `🎉 Nuovo Ordine Ricevuto - ${planName} - €${amountInEuros}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2D3748; margin-bottom: 10px;">🎉 Nuovo Ordine Ricevuto</h1>
                            <p style="color: #718096; font-size: 18px;">Notifica automatica per nuovo ordine</p>
                        </div>
                        
                        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h2 style="color: #2D3748; margin-bottom: 15px;">📦 Dettagli Ordine</h2>
                            
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: bold; color: #4A5568;">ID Ordine:</span>
                                    <span style="color: #2D3748; font-family: monospace;">${orderId}</span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: bold; color: #4A5568;">Cliente:</span>
                                    <span style="color: #2D3748;">${displayName}</span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: bold; color: #4A5568;">Email:</span>
                                    <span style="color: #2D3748;">
                                        <a href="mailto:${customerEmail}" style="color: #3182CE; text-decoration: none;">${customerEmail}</a>
                                    </span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: bold; color: #4A5568;">Piano:</span>
                                    <span style="color: #2D3748;">${planName}</span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: bold; color: #4A5568;">Importo:</span>
                                    <span style="color: #2D3748; font-weight: bold; font-size: 18px;">€${amountInEuros} ${currency.toUpperCase()}</span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-weight: bold; color: #4A5568;">Data:</span>
                                    <span style="color: #2D3748;">${new Date().toLocaleString('it-IT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background-color: #E6FFFA; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="color: #2D3748; margin-bottom: 10px;">📋 Prossimi Passi</h3>
                            <ul style="color: #4A5568; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Verifica i dettagli dell'ordine nel sistema</li>
                                <li>Controlla che l'email di conferma sia stata inviata al cliente</li>
                                <li>Se è un nuovo cliente, verifica che l'email di attivazione sia stata inviata</li>
                                <li>Prepara il piano di coaching personalizzato</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href="${adminDashboardUrl}" style="background-color: #3182CE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                Vai alla Dashboard
                            </a>
                        </div>
                        
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                            <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                                Petra Coaching - Sistema di Notifiche Automatiche
                            </p>
                        </div>
                    </div>
                `
            });

            // Update all email logs with provider ID
            const providerId = (result.data?.id as string) || null;
            await Promise.all(
                emailLogs.map(emailLog =>
                    this.prisma.emailLog.update({
                        where: { id: emailLog.id },
                        data: {
                            status: 'SENT',
                            providerId: providerId,
                        }
                    })
                )
            );

            console.log(`✅ Admin notification sent to ${adminEmails.length} admin(s):`, adminEmails.join(', '), 'Provider ID:', providerId);
            return {
                success: true,
                providerId: providerId,
                status: 'SENT',
                emailLogId: emailLogs[0]?.id || null, // Return first email log ID for reference
            };
        } catch (error: any) {
            // Update all email logs with failure status
            await Promise.all(
                emailLogs.map(emailLog =>
                    this.prisma.emailLog.update({
                        where: { id: emailLog.id },
                        data: {
                            status: 'FAILED',
                            errorMessage: error.message || 'Unknown error',
                        }
                    })
                )
            );

            console.error('❌ Failed to send admin notification email:', error.message || error);

            // Return failure info instead of throwing (so webhook doesn't fail)
            return {
                success: false,
                providerId: null as string | null,
                status: 'FAILED' as const,
                errorMessage: error.message || 'Unknown error',
                emailLogId: emailLogs[0]?.id || null,
            };
        }
    }

    private getPlanName(planId: string): string {
        const planNames: { [key: string]: string } = {
            'starter-plan': 'Piano Starter',
            'premium-plan': 'Piano Premium',
            'coaching-donna-starter': 'Coaching Donna - Starter',
            'coaching-donna-premium': 'Coaching Donna - Premium',
            'woman-starter-6w': 'Coaching Donna - Starter (6 settimane)',
            'woman-starter-18w': 'Coaching Donna - Starter (18 settimane)',
            'woman-starter-36w': 'Coaching Donna - Starter (36 settimane)',
            'woman-premium-6w': 'Coaching Donna - Premium (6 settimane)',
            'woman-premium-18w': 'Coaching Donna - Premium (18 settimane)',
            'woman-premium-36w': 'Coaching Donna - Premium (36 settimane)',
            'man-starter-6w': 'Coaching Uomo - Starter (6 settimane)',
            'man-starter-18w': 'Coaching Uomo - Starter (18 settimane)',
            'man-starter-36w': 'Coaching Uomo - Starter (36 settimane)',
            'man-premium-6w': 'Coaching Uomo - Premium (6 settimane)',
            'man-premium-18w': 'Coaching Uomo - Premium (18 settimane)',
            'man-premium-36w': 'Coaching Uomo - Premium (36 settimane)',
        };

        return planNames[planId] || planId;
    }


}