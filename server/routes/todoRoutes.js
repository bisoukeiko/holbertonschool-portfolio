import express from 'express';
import { getTodos, addTodo, updateTodo, updateTodoFlag, deleteTodo, deleteTodoByParty, addInitialTodos } from '../controllers/todoController.js';

const router = express.Router();

router.get('/select', getTodos);
router.post('/insert', addTodo);
router.post('/addInitialTodos', addInitialTodos);
router.put('/update/:id', updateTodo);
router.put('/updateFlag/:id', updateTodoFlag);
router.delete('/delete/:id', deleteTodo);
router.delete('/deleteByParty/:id', deleteTodoByParty);

export default router;
