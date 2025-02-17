import React, { useEffect, useState } from "react";
import axios from 'axios';


function Todo({ partyId }) {
    const [todos, setTodos] = useState([]);
    const [values, setValues] = useState({
        task: '',
        idParty: partyId,
        fg_done: ''
    });
    const [task, setTask] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    useEffect(()=> {
        axios.get(`http://localhost:5000/todo/select`, {params: { partyId: partyId }})
        .then(res => setTodos(res.data))
        .catch(err => console.log(err));
    }, [partyId])

    // addボタン押下
    const handleAddTask = (e) => {
        e.preventDefault();
        if (!values.task) {
            return;
        } else {
            axios.post('http://localhost:5000/todo/insert', values)
            .then(res => {
                console.log(res);
                setTodos(res.data);
                setTask('');
                setValues({
                    task: '',
                    idParty: partyId,
                    fg_done: ''
                });
            })
            .catch(err => console.log(err));
        }
    }

    // Editボタン押下
    const [updateId, setUpdateID] = useState(null);

    const handleEdit = (event, id, task) => {
        event.preventDefault();
        setIsEdit(true);
        setTask(task);
        setUpdateID(id);

    }

    // updateボタン押下
    const handleUpdateTask = (event) => {
        event.preventDefault();
        const updatedValues = { ...values };
        console.log(updatedValues);
        axios.put(`http://localhost:5000/todo/update/${updateId}`, updatedValues)
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
    
        axios.put('http://localhost:5000/todo/updatefg/'+id, updatedValues)
        .then(res => {
            console.log(res);
            setTodos(res.data);
            setTask('');
        })
        .catch(err => console.log(err));
    }

    // 削除ボタン押下
    const handleDelete = (id) => {
        axios.delete('http://localhost:5000/todo/delete/'+id)
        .then(res => {
            setTodos(res.data);
            setTask('');
        })
        .catch(err => console.log(err));
    }

    return (
        <div className='d-flex vh-100 w-100 justify-content-center'>
            <div className='w-100 bg-white rounded p-3'>
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
                                    <button onClick={ (event) => handleEdit(event, tbTodo.id_task, tbTodo.task)} className='btn btn-sm btn-outline-primary mx-2'>Edit</button>
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
