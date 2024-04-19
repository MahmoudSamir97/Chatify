require('dotenv').config();
const server = require('./index');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const db = process.env.DATABASE_URL;
mongoose
  .connect(db)
  .then(() => console.log('Connected to database successfully 😎'));

server.listen(PORT, () => {
  console.log(`Listening to server on port ${PORT}`);
});
