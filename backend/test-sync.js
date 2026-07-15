require('dotenv').config();
const connectDB = require('./src/config/db');
const syncBlogs = require('./src/utils/syncBlogs');

const run = async () => {
    await connectDB();
    await syncBlogs();
    process.exit();
};

run();
