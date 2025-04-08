import { createServer } from './createServer.js';
import dotenv from 'dotenv';

dotenv.config();

const server = createServer();

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`Server activated on: ${port}`);
});
