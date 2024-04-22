const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    const DB = process.env.DATABASE_URL;
    await mongoose.connect(DB);
    console.log('Connected to Database Successfully 😎');
  } catch (error) {
    console.log('Error connecting to MongoDB', error.message);
  }
};

module.exports = connectToMongoDB;
