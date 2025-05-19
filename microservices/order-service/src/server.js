const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
});
