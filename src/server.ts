import dotenv from 'dotenv';
import app from './app';
import connectToDB from './config/db';

dotenv.config();
const PORT = process.env.PORT;

async function bootstrap() {
    try {
        await connectToDB();
        console.log('✅ Mongo connected');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

bootstrap();