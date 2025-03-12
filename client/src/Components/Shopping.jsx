import React, { useEffect, useState } from "react";
import axios from 'axios';


function Shopping({ partyId }) {
    const [shopItems, setShopItems] = useState([]);
    const [values, setValues] = useState({
        valueItem: '',
        id_party: partyId,
        shop_fg_done: ''
    });
    const [itemValue, setItemValue] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [updateId, setUpdateID] = useState(null);
    const [errValidation, setErrValidation] = useState([]);


    useEffect(()=> {
        if (partyId) {
            axios.get(`http://localhost:5000/shopping/select`, {params: { partyId: partyId }})
            .then(res => setShopItems(res.data))
            .catch(err => console.log(err));
        }
    }, [partyId])


    // addボタン押下
    const handleAdd = (e) => {
        e.preventDefault();
        if (!values.valueItem) {
            return;
        } else {
            axios.post('http://localhost:5000/shopping/insert', values)
            .then(res => {
                // console.log(res);
                setShopItems(res.data);
                setItemValue('');
                setValues({
                    valueItem: '',
                    id_party: partyId,
                    shop_fg_done: ''
                });
                setErrValidation([]);
            })
            .catch((err) => {
                if (err.response && err.response.data.errors) {
                  setErrValidation(err.response.data.errors.join('\n'));
                } else {
                  console.error("Error updating user:", err);
                }
            })
        }
    }

    // Editボタン押下
    const handleEdit = (event, idItem, valueItem) => {
        event.preventDefault();
        setIsEdit(true);
        setValues(shopItems.find(item => item.id_item === idItem));
        setItemValue(valueItem);
        setUpdateID(idItem);

    }

    // updateボタン押下
    const handleUpdate = (event) => {
        event.preventDefault();
        const updatedValues = { ...values };
        // console.log('updatedValues', updatedValues);
        axios.put(`http://localhost:5000/shopping/update/${updateId}`, updatedValues)
        .then(res => {
            // console.log('update: ', res.data);
            setShopItems(res.data);
            setItemValue('');
            setIsEdit(false);
            setErrValidation([]);
        })
        .catch((err) => {
            if (err.response && err.response.data.errors) {
              setErrValidation(err.response.data.errors.join('\n'));
            } else {
              console.error("Error updating user:", err);
            }
        })
    }

    // ステータスの変更
    const handleDone = (event, idItem, currentFgDone) => {
        event.preventDefault();
        const updatedValues = { ...values, shop_fg_done: currentFgDone ? 0 : 1 };
        // console.log('id_party', updatedValues.id_party);
    
        axios.put('http://localhost:5000/shopping/updateFlag/'+idItem, updatedValues)
        .then(res => {
            // console.log('updateF: ', res.data);
            setShopItems(res.data);
            setItemValue('');
            setErrValidation([]);
        })
        .catch(err => console.log(err));
    }

    // 削除ボタン押下
    const handleDelete = (idItem) => {
        axios.delete('http://localhost:5000/shopping/delete/'+idItem, {data: {'id_party': partyId }})
        .then(res => {
            setShopItems(res.data);
            setItemValue('');
            setErrValidation([]);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className='d-flex w-100 mt-2'>
            <div className='card w-100 m-3'>
                <div className='card-header p-3'>
                    <h4 className='p-1'>Shopping List</h4>
                </div>
                <div className='card-body p-3'>

                    <form className="d-flex gap-2" onSubmit={isEdit ? handleUpdate : handleAdd}>
                        <label htmlFor="item" className="visually-hidden">itemValue</label>
                        <input 
                            id='item'
                            type='text'
                            value={itemValue}
                            placeholder=''
                            className='form-control text-break' 
                            onChange={e => {setItemValue(e.target.value);
                                setValues({...values, valueItem: e.target.value});
                            }}
                        />
                        <button type='submit' className='btn btn-outline-success btn-sm'>
                            {isEdit ? 'Update' : 'Add'}
                        </button>
                    </form>
        
                    {/* error message */}
                    <div>
                        {errValidation && (
                        <div className='text-danger ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                            {errValidation}
                        </div>
                        )}
                    </div>
                    
                    <table className='table'>
                        <colgroup>
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '65%' }} />
                            <col style={{ width: '25%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopItems?.map((tbShop, index) => {
                                return <tr key={index}>
                                    <td>
                                        <label>
                                            <input type='checkbox' checked={tbShop.shop_fg_done} readOnly onChange={(event) => handleDone(event, tbShop.id_item, tbShop.shop_fg_done)} />
                                        </label>
                                    </td>
                                    <td className={`${tbShop.shop_fg_done ? 'text-decoration-line-through text-secondary' : ''}`}>
                                        <div className='text-break'>
                                            {tbShop.shop_item}
                                        </div>
                                    </td>
                                    <td className='align-middle text-center'>
                                        <div className='align-items-end justify-content-center'>
                                            <span className='text-primary me-3' style={{ cursor: 'pointer' }} 
                                                onClick={(event) => handleEdit(event, tbShop.id_item, tbShop.shop_item)}>
                                                Edit
                                            </span>
                                            <span onClick={() => handleDelete(tbShop.id_item)} className='text-danger' style={{ cursor: 'pointer' }} >
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
        </div>
    )
}

export default Shopping;
