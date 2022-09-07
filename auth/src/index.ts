import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/users/currentuser', (req, res) => {
  res.send({ hi: 'hi' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
