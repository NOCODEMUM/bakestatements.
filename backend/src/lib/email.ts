```typescript
            import nodemailer from 'nodemailer';

            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || '587'),
              secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            interface SendEmailOptions {
              to: string;
              subject: string;
              html: string;
              from?: string;
              replyTo?: string;
            }

            export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailOptions) {
              const mailOptions = {
                from: from || process.env.SMTP_FROM,
                replyTo: replyTo || from || process.env.SMTP_FROM,
                to,
                subject,
                html,
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${to} with subject: ${subject}`);
              } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email');
              }
            }
            ```