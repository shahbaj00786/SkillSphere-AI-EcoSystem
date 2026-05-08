import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import env from './config/env.js';

const startServer = async () => {
  try {
    // connect to database
    await connectDB();
    // connect to cloudinary
    await connectCloudinary();

    // start server
    app.listen(env.port, () => {
      console.log(`✅ Server running on port ${env.port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();