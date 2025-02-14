import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import axios from 'axios';

function Child() {
    const { userId } = useUser();

    const [isAdd, setIsAdd] = useState(false);
    const [childList, setChildList] = useState([]);
    const [values, setValues] = useState({
        childId: '',
        id_parent: userId,
        child_name: '',
        child_birthday: ''
    });


    useEffect(() => {
        if (userId) {
          setValues(prevValues => ({ ...prevValues, id_parent: userId }));
          axios.get(`http://localhost:5000/child/selectByIdUser/`, {params: { userId: userId }})
            .then(res => {
              if (res.data.length !== 0) {
                console.log(res.data[0]);
                const childData = res.data.map(child => ({
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

    const handleAdd = (event) => {
      event.preventDefault();
      // console.log("Adding child with values:", values);
      if (!values.child_name) {
        return;
      } else {
          axios.post('http://localhost:5000/child/insert', values)
          .then(res => {
            const childData = res.data.map(child => ({...child, isEdit: false}));
            setChildList(childData);
            setValues({
              childId: '',
              id_parent: userId,
              child_name: '',
              child_birthday: ''      
            });
            setIsAdd(false);
          })
          .catch(err => console.log(err));
      }
    }


    const handleUpdate = (event, childId) => {
      event.preventDefault();

      const updatedValues = { ...values, childId: childId };
      // console.log(updatedValues);

      axios.put(`http://localhost:5000/child/update/${childId}`, updatedValues)
      .then(res => {
          // console.log(res);
          const childData = res.data.map(child => ({...child, isEdit: false}));
          setChildList(childData);
          setValues({
            childId: '',
            id_parent: userId,
            child_name: '',
            child_birthday: ''      
          });
    })
      .catch(err => console.log(err));
    };


    const handleDelete = (childId) => {
      axios.delete(`http://localhost:5000/child/delete/${childId}`, {params: { userId: userId }})
        .then(res => {
          if (res.data.length !== 0) {
            console.log(res.data[0]);
            const childData = res.data.map(child => ({
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
    <div className='d-flex min-vh-100 flex-column align-items-center'>
        <h2>Child Info</h2>
      <div  className='w-25 bg-white rounded p-3 '>

        {
          childList?.map((childData) => (
            <div key= {childData.id_child}>
              <form onSubmit={ (event) => {
                childData.isEdit ? handleUpdate(event, childData.id_child) : handleEdit(event,childData.id_child);
              }}>
                <div className='card  mb-2'>
                  <div className='card-header mb-2'>
                    <div className='d-flex align-items-center'>
                      <label className='me-2' htmlFor={`childName-${childData.id_child}`}></label>
                      {childData.isEdit ? (
                          <input id={`childName-${childData.id_child}`} type='text' placeholder='Name' className='form-control fs-5' value={childData.child_name}
                                onChange={event => handleChange(childData.id_child, 'child_name', event.target.value)}  required />                      
                        ) : ( 
                          <p className='fs-5 mb-0'>{childData.child_name}</p>
                        )}
                      <div className="invalid-feedback">
                         Please provide a valid name.
                      </div>
                    </div>
                  </div>
                  <div className='card-body flex-grow-1'>
                    <div className='mb-2'>
                      <div className='d-flex align-items-center'>
                        <label className='me-2' htmlFor='childbirthday'>Birthday:</label>
                        {childData.isEdit ? (
                          <input id='childbirthday' type='text' placeholder='YYYY-MM-DD'className='form-control fs-5' value={childData.child_birthday}
                                onChange={event => handleChange(childData.id_child, 'child_birthday', event.target.value)} required/>
                        ) : ( 
                          <p className='fs-5 mb-0'>{childData.child_birthday}</p>
                        )}
                      </div>
                    </div>
                    <div className='d-flex justify-content-end'>
                      <button className='btn btn-outline-primary btn-sm  me-2'>
                        {childData.isEdit ? 'Update' : 'Edit'}
                      </button>
                      <button onClick={ () => handleDelete(childData.id_child)} className='btn btn-outline-danger btn-sm'>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ))
        }

        {/* add nwe child */}
        {isAdd && (
          <form>
            <div className='card mb-2'>
              <div className='card-header mb-2'>
                <div className='d-flex align-items-center'>
                  <label className='me-2'></label>
                  <input type='text' placeholder='Name' className='form-control fs-5' value={values.child_name}
                        onChange={event => setValues({...values, 'child_name': event.target.value})} required/>
                </div>
              </div>
              <div className='card-body flex-grow-1'>
                <div className='mb-2'>
                  <div className='d-flex align-items-center'>
                    <label className='me-2'>Birthday:</label>
                    <input type='text' placeholder='YYYY-MM-DD'className='form-control fs-5' value={values.child_birthday}
                        onChange={event => setValues({...values, 'child_birthday': event.target.value})} required/>
                  </div>
                </div>
                <div className='d-flex justify-content-end'>
                <button onClick={  handleAdd } className='btn btn-outline-secondary btn-sm'>
                  Add
                </button>
              </div>
              </div>
            </div>
          </form>
        )}
        <div className='d-flex justify-content-end'>
          {!isAdd && (
            <button onClick={() => setIsAdd(true)} className='btn btn-light btn-sm fs-6 text m-2'> + Add a child</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Child