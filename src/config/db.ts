import mongoose from 'mongoose';

const connectToDB = async () => {
    const uri = process.env.MONGO_URL;
    if (!uri) {
        throw new Error('MONGO_URL is not defined');
    }

    try {
        if (mongoose.connections[0].readyState) return mongoose.connection;
        await mongoose.connect(uri);
        return mongoose.connection;
    } catch (error) {
        console.error('DB connection error:', error);
        return undefined;
    }
}

export default connectToDB