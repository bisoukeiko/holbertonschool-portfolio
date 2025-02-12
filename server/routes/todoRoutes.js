import express from 'express';
import { getTodos, addTodo, updateTodo, updateTodoFlag, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.get('/select', getTodos);
router.post('/add', addTodo);
router.put('/update/:id', updateTodo);
router.put('/updateFlag/:id', updateTodoFlag);
router.delete('/delete/:id', deleteTodo);

export default router;
