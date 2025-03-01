import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import axios from 'axios';

function User() {
  const { userId } = useUser();

  const [isEdit, setIsEdit] = useState(false);
  const [errValidation, setErrValidation] = useState([]);
  const [userInfo, setUserInfo] = useState({
    idUser: userId,
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

    //console.log("Updating user:", userInfo);
    axios.put(`http://localhost:5000/user/update`, userInfo)
    .then((res) => {
        //  console.log("User updated successfully:", res.data);
        // alert("User updated successfully!");
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
    
    
  };


  return (
    <div className='d-flex flex-column align-items-center mt-5 mb-4'>
      <div className='w-100 bg-white rounded mt-3'>

          <form>
              <div className='card d-flex flex-column'>
                <div className='card-header'>
                    <label htmlFor='userName'>User name:</label>
                    {isEdit ? (
                        <input id='userName' type='text' placeholder='Enter user name' className='form-control fs-5' value={userInfo.userName}
                        onChange={e => setUserInfo({...userInfo, userName: e.target.value})}/>
                    ) : (
                      <p className='fs-5'>{userInfo.userName}</p>
                    )}
                </div>
                <div className='card-body flex-grow-1'>
                  <div className='mb-1'>
                      <label htmlFor='userEmail'>E-mail:</label>
                      {isEdit ? (
                        <input id='userEmail' type='text' placeholder='Enter e-mail' className='form-control fs-5' value={userInfo.userEmail}
                        onChange={e => setUserInfo({...userInfo, userEmail: e.target.value})}/>
                      ) : (
                        <p className='fs-5'>{userInfo.userEmail}</p>
                      )}
                  </div>
                  {/* <div className='mb-1'>
                      <label htmlFor='userPhone'>phone:</label>
                      {isEdit ? (
                        <input id='userPhone' type='text' placeholder='Enter phone number' className='form-control fs-5' value={userInfo.userPhone}
                        onChange={e => setUserInfo({...userInfo, userPhone: e.target.value})}/>
                      ) : (
                        <p className='fs-5'>{userInfo.userPhone}</p>
                      )}
                  </div> */}
                  <div className='d-flex justify-content-end'>
                    {/* <span onClick={handleCancel} className='text-danger mt-3 me-2 p-2'  style={{ cursor: 'pointer' }}>
                        Cancel
                    </span> */}

                    <span className='text-primary me-2' style={{ cursor: 'pointer' }}  onClick={isEdit ? handleUpdate : handleEdit}>
                      {isEdit ? 'Update' : 'Edit'}
                    </span>
                  </div>
                </div>
              </div>
          </form>

          {/* error message */}
          <div>
            {errValidation && (
              <div className='text-danger ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                {errValidation}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default User