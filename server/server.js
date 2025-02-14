import express from 'express';
import cors from 'cors';
import db from './db.js';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import childRoutes from './routes/childRoutes.js';


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/child', childRoutes);
app.use('/todo', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
