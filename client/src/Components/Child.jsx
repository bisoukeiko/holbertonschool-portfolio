import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Form } from 'react-bootstrap';

function Child() {
    const { userId } = useUser();
    const navigate = useNavigate();

    const [isAdd, setIsAdd] = useState(false);
    const [errValidationChild, setErrValidationChild] = useState([]);

    const [childList, setChildList] = useState([]);
    const [values, setValues] = useState({
        childId: '',
        id_parent: userId,
        child_name: '',
        child_birthday: '',
        child_parties: []
    });


    useEffect(() => {
        if (userId) {
          // setValues(prevValues => ({ ...prevValues, id_parent: userId }));
          axios.get(`http://localhost:5000/child/selectChildParty/`, {params: { userId: userId }})
            .then(res => {
              if (res.data.length !== 0) {
                // console.log(res.data);
                const childData = res.data.parties.map(child => ({
                  ...child, isEdit: false
                }));
                setChildList(childData);
              } else {
                setChildList([]);  
              }
            })
            .catch(err => console.log(err))
          } else {
            setChildList([]);
          }
    }, [userId]);


    const handleEdit = (event, childId) => {
      event.preventDefault();
      // 現在のchildListから対象のchildデータを取得
      const targetChild = childList.find(child => child.id_child === childId);

      if (!targetChild) return;

      // 既存の値を保持しながら、変更された値だけを更新
      setValues({ ...targetChild, id_parent: userId });
      setChildList(childList.map(child =>
        child.id_child === childId ? {...child, isEdit: true} : child
      ));
    };

    // 更新処理
    const handleChange = (childId, field, value) => {
      setValues({ ...values, [field]: value});

      setChildList(childList.map(child =>
        child.id_child === childId ? {...child, [field]: value} : child
      ));  
    }

    const handleCancel = () => {
      setValues({
          childId: '',
          id_parent: userId,
          child_name: '',
          child_birthday: '',
          child_parties: []
      });
      setIsAdd(false);
      setErrValidationChild([])
    }

    const handleAdd = (event) => {
      event.preventDefault();
      setErrValidationChild([]);
      // console.log("Adding child with valueChild:", values);
      if (!values.child_name) {
          setErrValidationChild(['Child name is required.']);
      } else {
          axios.post('http://localhost:5000/child/insert', values)
          .then(res => {
            const childData = res.data.parties.map(child => ({...child, isEdit: false}));
            setChildList(childData);
            setValues({
              childId: '',
              id_parent: userId,
              child_name: '',
              child_birthday: '',
              child_parties: []      
            });
            setIsAdd(false);
            setErrValidationChild([]);
          })
          .catch((err) => {
            if (err.response && err.response.data.errors) {
              setErrValidationChild(err.response.data.errors.join('\n'));
              console.log('validerr:',  err.response.data.errors);
            } else {
              console.error("Error insert child:", err);
            }
          })
      }
    }


    const handleUpdate = (event, childId) => {
      event.preventDefault();
      setErrValidationChild([]);

      const updatedValues = { ...values, childId: childId };
      // console.log(updatedValues);

      axios.put(`http://localhost:5000/child/update/${childId}`, updatedValues)
      .then(res => {
          // console.log(res);
          const childData = res.data.parties.map(child => ({...child, isEdit: false}));
          setChildList(childData);
          setValues({
              childId: '',
              id_parent: userId,
              child_name: '',
              child_birthday: ''      
          });
          setErrValidationChild([]);
      })
      .catch((err) => {
        if (err.response && err.response.data.errors) {
          setErrValidationChild(err.response.data.errors.join('\n'));
          console.log('validerr:',  err.response.data.errors);
        } else {
          console.error("Error insert child:", err);
        }
      })
   };


    const handleDelete = (childId) => {
      axios.delete(`http://localhost:5000/child/delete/${childId}`, {params: { userId: userId }})
        .then(res => {
          if (res.data.length !== 0) {
            // console.log(res.data.parties.[0]);
            const childData = res.data.parties.map(child => ({
              ...child, isEdit: false
            }));
            setChildList(childData);
          } else {
            setChildList([]);  
          }
        })
        .catch(err => console.log(err));
    }

  return (

    <div className='d-flex ustify-content-center align-items-center mt-1'>
      <div className='w-100 p-3'>
        <div className='d-flex justify-content-start ms-5 mt-5'>
          {!isAdd && (
            <button onClick={() => setIsAdd(true)} className='btn btn-outline-success mb-2 me1'> + Add a new child</button>
          )}
        </div>



        {/* add new child */}
        {isAdd ? (
          <form>

            {/* error message */}
            <div>
                {errValidationChild && (
                    <div className='text-danger ms-2' style={{ whiteSpace: 'pre-wrap' }}>
                        {errValidationChild}
                    </div>
                )}
            </div>

            <div className='card mb-2 mt-5' style={{ width: '18rem' }}>
              <div className='card-header mb-2'>
                <div className='d-flex align-items-center'>
                  <label className='me-2'></label>
                  <input type='text' placeholder='Child name' className='form-control' value={values.child_name}
                        onChange={event => setValues({...values, 'child_name': event.target.value})} required/>
                </div>
              </div>
              <div className='card-body flex-grow-1'>
                <div className='mb-2'>
                  <div>
                      <Form.Group>
                          <Form.Label>Birthday:</Form.Label>
                          <Form.Control
                              type='date'
                              value={values.child_birthday}
                              onChange={event => (setValues({...values, 'child_birthday': event.target.value}))}
                              required
                          />
                      </Form.Group>
                  </div>
                </div>
                <div className='d-flex justify-content-end'>
                <span onClick={handleCancel} className='text-danger mt-3 me-3'  style={{ cursor: 'pointer' }}>
                    Cancel
                </span>
                <button onClick={  handleAdd } className='btn btn-outline-success mt-2'>
                  Add
                </button>
              </div>
              </div>
            </div>
          </form>
        ) : (
          <div className='d-flex justify-content-center'>
          <div className='d-flex flex-wrap gap-3'>
            {/* Child Cards */}
            { 
              childList?.map((childData) => (
                <div key= {childData.id_child} className='card mb-3 mt-3' style={{ width: '18rem' }}>
                  <div className='card-header'>

                    {/* error message */}
                    <div>
                        {errValidationChild && (
                            <div className='text-danger mb-2 ms-2' style={{ whiteSpace: 'pre-wrap' }}>
                                {errValidationChild}
                            </div>
                        )}
                    </div>

                    {/* child name */}
                    {childData.isEdit ? (
                      <div>                  
                        <label className='me-2' htmlFor={`childName-${childData.id_child}`}>Name</label>
                        <input id={`childName-${childData.id_child}`} type='text' placeholder='Name' className='form-control mb-2' value={childData.child_name}
                              onChange={event => handleChange(childData.id_child, 'child_name', event.target.value)}  required />                      
                      </div>
                      ) : ( 
                        <div className='fs-5 mb-1'>{childData.child_name}</div>
                    )}


                    {/* child birthday */}
                    {childData.isEdit ? (            
                        <div>
                            <Form.Group>
                                <Form.Label>Birthday:</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={childData.child_birthday}
                                    onChange={event => handleChange(childData.id_child, 'child_birthday', event.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                    ) : ( 
                        <div>Birthday: {childData.child_birthday}</div>
                    )}

                    {/* Edit Delete */}
                    <div className='d-flex justify-content-end'>
                        <span className='text-primary me-2' style={{ cursor: 'pointer' }} 
                              onClick={ (event) => {
                                childData.isEdit ? handleUpdate(event, childData.id_child) : handleEdit(event,childData.id_child);}}>
                            {childData.isEdit ? 'Update' : 'Edit'}
                        </span>
                        <span onClick={ () => handleDelete(childData.id_child)} className='text-danger' style={{ cursor: 'pointer' }} >
                            Delete
                        </span>
                        {/* <span onClick={handleCancel} className='text-danger ms-2' style={{ cursor: 'pointer' }} >
                            Cancel
                        </span> */}
                    </div>
                  </div>

                  <div className='card-body'>
                      <h6>Parties:</h6>
                      {childData.child_parties && childData.child_parties.length > 0 ? (
                          <ul className='list-unstyled'>
                              {childData.child_parties.map((partyData) => (
                                  <li key = {partyData.idParty} >
                                      <p  className='text-dark cursor-pointer ms-3' 
                                          style={{ cursor: 'pointer' }} 
                                          onClick={() => navigate('/party', { state: { partyId: partyData.idParty } })}
                                          onMouseEnter={(e) => e.target.classList.replace('text-dark', 'text-primary')}
                                          onMouseLeave={(e) => e.target.classList.replace('text-primary', 'text-dark')}>
                                        {partyData.childYears} years old
                                      </p>
                                  </li>
                              ))}
                          </ul>
                      ):(
                          <p className='ms-3'>No parties registered</p>
                      )}
                  </div>
                  <span className='text-end text-success me-3 mb-3'style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/party', { state: { fgAdd: true, childId: childData.id_child, childName: childData.child_name } })}>
                      + add a new party
                  </span>
                </div>
              ))
            }
          </div>
          </div>
        )}


      </div>
    </div>

  );
}

export default Child