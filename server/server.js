import dotenv from 'dotenv';
dotenv.config();

// Workaround for Node.js failing to resolve SRV/A records in some Windows environments
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to DB first, then start HTTP server
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.syscall !== 'listen') throw error;
      
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: Port ${PORT} is already in use.`);
        console.error(`   → Another instance of the server is likely running in the background.`);
        console.error(`   → Run 'npx kill-port ${PORT}' or terminate the process to free it.`);
        process.exit(1);
      }
      
      console.error('❌ Server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
