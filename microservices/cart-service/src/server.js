require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
