
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
    context?: Record<string, any>;
}

export class MailService {
    private transporter: nodemailer.Transporter;
    private from: string;
    private handlebarsReady: Promise<void>;

    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const secure = process.env.SMTP_SECURE === "true";
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        this.from = process.env.SMTP_FROM || "";

        if (!host || !user || !pass || !port) {
            throw new Error("SMTP configuration missing.");
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
            logger: true,
            debug: true,
        });

        this.handlebarsReady = this.attachHandlebars();
    }

    private async attachHandlebars(): Promise<void> {
        const { default: hbs } = await import(
            "nodemailer-express-handlebars"
        );

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
        await this.handlebarsReady;

        const { to, name, link } = options;

        const mailOptions: TemplateMailOptions = {
            from: this.from,
            to,
            subject: "Reset your password",
            template: "reset-password",
            context: {
                name,
                resetLink: link,
            },
        };

        try {
            console.log("Password Reset Link:", link);

            const info = await this.transporter.sendMail(mailOptions);

            console.log(
                `Password reset email sent to ${to}. MessageId: ${info.messageId}`
            );

            return info;
        } catch (error) {
            console.error("Password reset email error:", error);
            throw error;
        }
    }

    async sendTestEmail(to: string) {
        await this.handlebarsReady;

        const mailOptions: TemplateMailOptions = {
            from: this.from,
            to,
            subject: "SMTP Test Email",
            template: "reset-password",
            context: {
                name: "Test User",
                resetLink: "https://example.com",
            },
        };

        const info = await this.transporter.sendMail(mailOptions);

        console.log(
            `Test email sent to ${to}. MessageId: ${info.messageId}`
        );

        return info;
    }

    async sendVerifyToken(to: string, token: number) {
        await this.handlebarsReady;

        try {
            const mailOptions: TemplateMailOptions = {
                from: this.from,
                to,
                subject: "Register Confirmation",
                template: "verify-register",
                context: {
                    verify: token,
                },
            };

            const info = await this.transporter.sendMail(mailOptions);

            console.log(
                `Verification email sent to ${to}. MessageId: ${info.messageId}`
            );

            return info;
        } catch (error) {
            console.error("Verification email error:", error);
            throw error;
        }
    }
}
