import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import axios from 'axios';

function User() {
  const { userId } = useUser();

  const [isEdit, setIsEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({
    idUser: '',
    userName: '',
    userEmail: '',
    userPhone: ''
  });

  useEffect(()=>{
    if (userId) {
      axios.get(`http://localhost:5000/user/selectById`,  {params: { userId: userId }})
      .then(res => {
          // console.log(res.data[0]);
          setUserInfo({
            idUser: res.data[0].id_user,
            userName: res.data[0].user_name,
            userEmail: res.data[0].user_email,
            userPhone: res.data[0].user_phone
          });
      })
      .catch(err => console.log(err))
    } else {
      setUserInfo({
        idUser: '',
        userName: '',
        userEmail: '',
        userPhone: ''    
      });
    }
  }, [userId]);

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEdit(true);
    return;
  }

  const handleUpdate = (e) => {
    e.preventDefault();

    console.log("Updating user:", userInfo);
    axios.put(`http://localhost:5000/user/update`, userInfo)
    .then((res) => {
      console.log("User updated successfully:", res.data);
      // alert("User updated successfully!");
    })
    .catch((err) => console.error("Error updating user:", err));
    
    setIsEdit(false);
  };


  return (
    <div className='d-flex vh-100 flex-column align-items-center'>
      <h2>User Info</h2>
      <div className='w-25 bg-white rounded p-3 '>
          <form onSubmit={isEdit ? handleUpdate : handleEdit}>

              <div className='card d-flex flex-column h-100'>
                <div className='card-header'>
                    <label htmlFor='userName'>user name:</label>
                    {isEdit ? (
                        <input id='userName' type='text' placeholder='Enter user name' className='form-control fs-5' value={userInfo.userName}
                        onChange={e => setUserInfo({...userInfo, userName: e.target.value})}/>
                    ) : (
                      <p className='fs-5'>{userInfo.userName}</p>
                    )}
                </div>
                <div className='card-body flex-grow-1'>
                  <div className='mb-1'>
                      <label htmlFor='user'>e-mail:</label>
                      {isEdit ? (
                        <input id='userEmail' type='text' placeholder='Enter e-mail' className='form-control fs-5' value={userInfo.userEmail}
                        onChange={e => setUserInfo({...userInfo, userEmail: e.target.value})}/>
                      ) : (
                        <p className='fs-5'>{userInfo.userEmail}</p>
                      )}
                  </div>
                  <div className='mb-1'>
                      <label htmlFor='user'>phone:</label>
                      {isEdit ? (
                        <input id='userPhone' type='text' placeholder='Enter phone number' className='form-control fs-5' value={userInfo.userPhone}
                        onChange={e => setUserInfo({...userInfo, userPhone: e.target.value})}/>
                      ) : (
                        <p className='fs-5'>{userInfo.userPhone}</p>
                      )}
                  </div>
                  <div className='d-flex justify-content-end'>
                    <button className='btn btn-outline-primary btn-sm'>
                      {isEdit ? 'Update' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
          </form>
      </div>
    </div>
  )
}

export default User