import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

type PasswordResetOptions = {
    to: string;
    name: string;
    link: string;
};

interface TemplateMailOptions extends nodemailer.SendMailOptions {
    template?: string;
    context?: any;
}

export class MailService {
    private transporter: nodemailer.Transporter;
    private from: string;

    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const secure = process.env.SMTP_SECURE === 'true';
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        this.from = process.env.SMTP_FROM || "";

        if (!host || !user || !pass || !port) {
            console.warn('SMTP configuration missing. Emails may fail to send.');
            throw { status: 500, message: 'Internal Server Error' };
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            logger: true,
            debug: true
        });

        this.attachHandlebars()
    }

    private async attachHandlebars() {
        const { default: hbs } = await import("nodemailer-express-handlebars");
        const templatesDir = path.join(__dirname, "templates");

        this.transporter.use(
            "compile",
            hbs({
                viewEngine: {
                    extname: ".hbs",
                    partialsDir: templatesDir,
                    layoutsDir: templatesDir,
                    defaultLayout: undefined,
                },
                viewPath: templatesDir,
                extName: ".hbs",
            })
        );
    }

    async sendPasswordReset(options: PasswordResetOptions) {
        const { to, name, link } = options;
        const mailOptions: TemplateMailOptions = {
            from: this.from,
            to,
            subject: "Reset your password",
            template: "reset-password",
            context: { name, resetLink: link },
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}. MessageId: ${info.messageId}`);
        return info;
    }

    async sendTestEmail(to: string) {
        const mailOptions: TemplateMailOptions = {
            from: this.from,
            to,
            subject: "✅ SMTP Test Email",
            template: "reset-password",
            context: { name: "arash", resetLink: "https://example.com" },
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Test email sent to ${to}. MessageId: ${info.messageId}`);
        return info;
    }

    async sendVerifyToken(to: string, token: number) {
        try {
            const mailOptions: TemplateMailOptions = {
                from: this.from,
                to,
                subject: "Register Confirmation",
                template: "verify-register",
                context: { verify: token },
            };

            const info = await this.transporter.sendMail(mailOptions);

            console.log(`✅ Verification email sent to ${to}. MessageId: ${info.messageId}`);
            return info;
        } catch (err: any) {
            console.error("Email sending error:", err);
            throw { status: err?.status || 500, message: err?.message || "Email sending failed" };
        }
    }
}