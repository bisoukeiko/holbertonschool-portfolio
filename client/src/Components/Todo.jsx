import React, { useEffect, useState } from "react";
import axios from 'axios';


function Todo({ partyId }) {
    const [todos, setTodos] = useState([]);
    const [values, setValues] = useState({
        task: '',
        id_party: partyId,
        fg_done: ''
    });
    const [task, setTask] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [updateId, setUpdateID] = useState(null);

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
                    id_party: partyId,
                    fg_done: ''
                });
            })
            .catch(err => console.log(err));
        }
    }

    // Editボタン押下
    const handleEdit = (event, id, task) => {
        event.preventDefault();
        setIsEdit(true);
        setValues(todos.find(todo => todo.id_task === id));
        setTask(task);
        setUpdateID(id);

    }

    // updateボタン押下
    const handleUpdateTask = (event) => {
        event.preventDefault();
        const updatedValues = { ...values };
        console.log('updatedValues', updatedValues);
        axios.put(`http://localhost:5000/todo/update/${updateId}`, updatedValues)
        .then(res => {
            // console.log('update: ', res.data);
            setTodos(res.data);
            setTask('');
            setIsEdit(false);

        })
        .catch(err => console.log(err));

    }

    // ステータスの変更
    const handleTodoDone = (event, id, currentFgDone) => {
        event.preventDefault();
        const updatedValues = { ...values, fg_done: currentFgDone ? 0 : 1 };
        // console.log('id_party', updatedValues.id_party);
    
        axios.put('http://localhost:5000/todo/updateFlag/'+id, updatedValues)
        .then(res => {
            // console.log('updateF: ', res.data);
            setTodos(res.data);
            setTask('');
        })
        .catch(err => console.log(err));
    }

    // 削除ボタン押下
    const handleDelete = (id) => {
        axios.delete('http://localhost:5000/todo/delete/'+id, {data: {'id_party': partyId }})
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
                        placeholder='Enter the task'
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
                                <td className={`${tbTodo.fg_done ? 'text-decoration-line-through' : ''}`}>
                                    <div className='text-break'>
                                        {tbTodo.task}
                                    </div>
                                </td>
                                <td className='align-middle text-center'>
                                    <div className='d-flex flex-column align-items-end justify-content-center'>
                                        <span className='text-primary' style={{ cursor: 'pointer' }} 
                                            onClick={(event) => handleEdit(event, tbTodo.id_task, tbTodo.task)}>
                                            Edit
                                        </span>
                                        <span onClick={() => handleDelete(tbTodo.id_task)} className='text-danger' style={{ cursor: 'pointer' }} >
                                            Delete
                                        </span>
                                    </div>
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
