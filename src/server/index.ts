const express = require('express');
const app = express();

const { PORT } = process.env;

app.get('/', (req, res) => res.send('Hello, Money!'));

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
