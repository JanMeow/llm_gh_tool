import "dotenv/config";
import express from 'express';
import agentRouter from './state.js';

const app = express();
const port: number = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Agent routes
app.use('/agent', agentRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
