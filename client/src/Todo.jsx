import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';


function Todo() {
    const [todos, setTodos] = useState([]);
    const [values, setValues] = useState({
        task: '',
        fg_done: ''
    });
    const [task, setTask] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    useEffect(()=> {
        axios.get('http://localhost:5000/')
        .then(res => setTodos(res.data))
        .catch(err => console.log(err));
    }, [])

    // addボタン押下
    const handleAddTask = (e) => {
        e.preventDefault();
        if (!values.task) {
            return;
        } else {
            axios.post('http://localhost:5000/todoadd', values)
            .then(res => {
                console.log(res);
                setTodos(res.data);
                setTask('');
                setValues('');
            })
            .catch(err => console.log(err));
        }
    }

    // Editボタン押下
    const [updateId, setUpdateID] = useState(null);
    const [updatedTask, setUpdatedTask] = useState('');

    const handleEdit = (event, id, task) => {
        event.preventDefault();
        setIsEdit(true);
        setTask(task);
        setUpdatedTask(task);
        setUpdateID(id);

    }

    // updateボタン押下
    const handleUpdateTask = (event) => {
        event.preventDefault();
        const updatedValues = { ...values };
        console.log(updatedValues);
        axios.put(`http://localhost:5000/todoupdate/${updateId}`, updatedValues)
        .then(res => {
            console.log(res);
            setTodos(res.data);
            setTask('');
            setIsEdit(false);

        })
        .catch(err => console.log(err));

    }

    // ステータスの変更
    const handleTodoDone = (event, id, currentFgDone) => {
        event.preventDefault();
        const updatedValues = { fg_done: currentFgDone ? 0 : 1 };
    
        axios.put('http://localhost:5000/todoupdatefg/'+id, updatedValues)
        .then(res => {
            console.log(res);
            setTodos(res.data);
            setTask('');
        })
        .catch(err => console.log(err));
    }

    // 削除ボタン押下
    const handleDelete = (id) => {
        axios.delete('http://localhost:5000/tododelete/'+id)
        .then(res => {
            setTodos(res.data);
            setTask('');
        })
        .catch(err => console.log(err));
    }

    return (
        <div className='d-flex vh-100 w-75 justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>ToDo List</h2>
                <form className="d-flex gap-2" onSubmit={isEdit ? handleUpdateTask : handleAddTask}>
                    <label htmlFor="task" className="visually-hidden">Task</label>
                    <input 
                        id='task'
                        type='text'
                        value={task}
                        placeholder='Enter todo'
                        className='form-control' 
                        onChange={e => {setTask(e.target.value);
                            setValues({...values, task: e.target.value});
                        }}
                    />
                    <button type='submit' className='btn btn-success'>
                        {isEdit ? 'Update' : 'add'}
                    </button>
                </form>
                
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos?.map((tbTodo, index) => {
                            return <tr key={index}>
                                <td>
                                    <label>
                                        <input type='checkbox' checked={tbTodo.fg_done} readOnly onChange={(event) => handleTodoDone(event, tbTodo.id_task, tbTodo.fg_done)} />
                                    </label>
                                </td>
                                <td className={`${tbTodo.fg_done ? 'text-decoration-line-through' : ''}`}>{tbTodo.task}</td>
                                <td>
                                    <button onClick={ (event) => handleEdit(event, tbTodo.id_task, tbTodo.task)} className='btn btn-sm btn-outline-info mx-2'>Edit</button>
                                    <button onClick={ () => handleDelete(tbTodo.id_task)} className='btn btn-sm btn-outline-danger'>Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Todo;
