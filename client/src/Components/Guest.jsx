import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Dropdown } from 'react-bootstrap';


function Guest({ partyId, childId }) {

    const [isEdit, setIsEdit] = useState(false);
    const [isEditFg, setIsEditFg] = useState(false);
    const [isDisplay, setIsDisplay] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [errValidation, setErrValidation] = useState([]);
    const [noGuestsMsg, setNoGuestsMsg] = useState(''); 

    const [guestList, setGuestList] = useState([]);
    const [allGuestList, setAllGuestList] = useState([]);
    const [attendCount, setAttendCount] = useState(0);
    const [guestValue, setGuestValue] = useState({
        idGuest: '',
        guestName: '',
        guestRelation: '',
        guestAllergy: '',
        otherInfo: '',
        parentPhone: '',
        parentEmail: '',
        idParty: '',
        fgAttend: ''
    });


    useEffect(() => {
      if (partyId) {
          axios.get(`http://localhost:5000/guest/select`, {params: { partyId: partyId }})
              .then(res => {
                  setGuestList(res.data);
                  if (res.data.length && res.data.length > 0) {        
                      setNoGuestsMsg('');
                      // setIsDisplay(false);
                  } else {
                      setNoGuestsMsg('No guests registered for this party.');
                  }
              })
              .catch(err => console.log(err));
       }
      
    }, [partyId]);


    useEffect(() => {
      if (guestList) {
          axios.get(`http://localhost:5000/guest/selectAllGuest`, {params: { childId: childId }})
              .then(res => {
                  setAllGuestList(res.data);
              })
              .catch(err => console.log(err));

          axios.get(`http://localhost:5000/guest/getAttendCount`, {params: { partyId: partyId }})
          .then(res => {
              setAttendCount(res.data[0].count);
          })
          .catch(err => console.log(err));
       }
      
    }, [guestList]);


    const handleGuestDetail = (event, guestData) => {
        event.preventDefault();
        setGuestValue(guestData)
        setIsAdd(false);
        setIsEditFg(false);
        setIsDisplay(true);
    }

    const handleChange = (guestId, field, value) => {
        setGuestValue({ ...guestValue, [field]: value});
    };

    const handleEdit = (e) => {
      e.preventDefault();
      setIsEdit(true);
    }

    const handleClickAdd = () => {
      setIsAdd(true); 
      setIsEdit(false);
      setIsEditFg(false);
      setIsDisplay(true);
      setGuestValue([]);
    } 

    const handleReset = () => {
      setGuestValue({
          idGuest: '',
          guestName: '',
          guestRelation: '',
          guestAllergy: '',
          otherInfo: '',
          parentPhone: '',
          parentEmail: '',
          fgAttend: ''
      })
    }

    const handleCancel = () => {
      setGuestValue({
          idGuest: '',
          guestName: '',
          guestRelation: '',
          guestAllergy: '',
          otherInfo: '',
          parentPhone: '',
          parentEmail: '',
          fgAttend: ''
      })
      setIsAdd(false); 
      setIsEdit(false);
      setIsEditFg(false);
      setIsDisplay(false);
      setGuestValue([]);
    }

    const getButtonClass = (fgAttend) => {
      switch (fgAttend) {
        case '1':
          return 'text-success fw-semibold';  // Attend
        case '2':
          return 'text-danger';   // Not Attend
        default:
          return 'text-secondary'; // No answer
      }
    };
    
    const getButtonLabel = (fgAttend) => {
      switch (fgAttend) {
        case '1':
          return 'Attend';
        case '2':
          return "Can't Attend";
        default:
          return 'No answer';
      }
    };

  
    const handleEditFg = (event, guestData) => {
        event.preventDefault();
        setGuestValue(guestData)
        setIsAdd(false);
        setIsEdit(false);
        setIsEditFg(true);
        setIsDisplay(true);
    }

    const handleAdd = (event) => {
        event.preventDefault();

        setErrValidation([]);
        if (!guestValue.guestName) {
          setErrValidation(['Guest name is required.']);
          return;
        }

        // console.log('insert guestValue: ', guestValue);
        axios.post('http://localhost:5000/guest/insert', {...guestValue, 'partyId': partyId })
          .then(res => {
              setGuestList(res.data);
              setIsAdd(false);
              setIsDisplay(false);
              setGuestValue([]);
              setErrValidation([]);
              setNoGuestsMsg('');
          })
          .catch((err) => {
            if (err.response && err.response.data.errors) {
              setErrValidation(err.response.data.errors.join('\n'));
            } else {
              console.error('Error insert guest:', err);
            }
        })
    }

    // updateボタン押下
    const handleUpdate = (event) => {
      event.preventDefault();
      const updatedValues = { ...guestValue };
      // console.log('updatedValues', updatedValues);
      axios.put(`http://localhost:5000/guest/update/${updatedValues.idGuest}`, updatedValues)
      .then(res => {
          // console.log('update: ', res.data);
          setGuestList(res.data);
          setIsEdit(false);
          setIsDisplay(false);
          setGuestValue([]);
          setErrValidation([]);

      })
      .catch((err) => {
          if (err.response && err.response.data.errors) {
            setErrValidation(err.response.data.errors.join('\n'));
          } else {
            console.error('Error updating guest:', err);
          }
      })

  }


    const handleUpdateFg = (event) => {
      event.preventDefault();
      const updatedValues = { ...guestValue };
      axios.put(`http://localhost:5000/guest/updateFlag/${updatedValues.idGuest}`, {...updatedValues, 'partyId': partyId})
      .then(res => {
          // console.log('update: ', res.data);
          setGuestList(res.data);
          setIsEditFg(false);
          setIsDisplay(false);
          setGuestValue([]);
      })
      .catch(err => console.log(err));   
    }

    const handleDelete = (event) => {
      event.preventDefault();
        const guestId = guestValue.idGuest;
        // console.log('delete guestId: ', guestId);

        axios.delete(`http://localhost:5000/guest/deletePartyGuest/${guestId}`, {data: { partyId: partyId }})
        .then(res => {
            setGuestList(res.data);
            if (res.data.length && res.data.length > 0) {        
                setNoGuestsMsg('');
                setIsDisplay(false);
                setGuestValue([]);
            } else {
                setNoGuestsMsg('No guests registered for this party.');
            }
        })
        .catch(err => console.log(err));
    }


  return (

    <div className='container mt-4'> 
      {!isDisplay ? (
        <div className='row  g-0'>
            <div className='col'>
                <div className='d-flex w-100'>
                    <div className='card w-100'>
                        <div className='card-header'>
                          <div className='d-flex justify-content-between align-items-center m-2'>
                            <h4>Guests</h4>
                            <div className='fs-5'>
                              {attendCount} guest{attendCount === 0 || attendCount === 1 ? '' : 's'} will attend.
                            </div>
                            <div>
                                {/* Add button */}
                                {!isAdd && (
                                    <button onClick={handleClickAdd} className='btn btn-outline-success'>
                                        + Add a guest
                                    </button>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className='card-body p-3'>

                          <div className='table-responsive  w-100'>
                            <table className='table table-hover table-bordered table-sm w-100'>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '35%' }} />
                                    <col style={{ width: '20%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th><div className='text-center'>Guest</div></th>
                                        <th><div className='text-center'>Attend</div></th>
                                        <th><div className='text-center'>Allergy</div></th>
                                        <th><div className='text-center'>Other Information</div></th>
                                        <th><div className='text-center'>Parents <br></br>Phone Number</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guestList?.map((tbGuest, index) => {
                                            return <tr key={index}>
                                                <td className='text-break'>
                                                  <div  className='text-dark cursor-pointer ps-2'
                                                        style={{ cursor: 'pointer' }}
                                                        onMouseEnter={(e) => e.target.classList.replace('text-dark', 'text-primary')}
                                                        onMouseLeave={(e) => e.target.classList.replace('text-primary', 'text-dark')}
                                                        onClick={(event) => handleGuestDetail(event, tbGuest)}>
                                                    {tbGuest.guestName}{tbGuest.guestRelation ? ` (${tbGuest.guestRelation})` : ''}
                                                  </div>
                                                </td>
                                                <td>
                                                  <div  className={`text-center ${getButtonClass(tbGuest.fgAttend)}`}
                                                        onClick={(event) => handleEditFg(event, tbGuest)}
                                                        style={{ cursor: 'pointer' }}>
                                                    {getButtonLabel(tbGuest.fgAttend)}
                                                  </div>
                                                </td>
                                                <td className=''>
                                                  <div className='text-center text-break'>
                                                    {tbGuest.guestAllergy || '-'}
                                                  </div>
                                                </td>
                                                <td className=''>
                                                  <div className='ps-2 text-break'>
                                                    {tbGuest.otherInfo}
                                                  </div>
                                                </td>
                                                <td className=''>
                                                  <div className='ps-2 text-break text-center'>
                                                    {tbGuest.parentPhone}
                                                  </div>
                                                </td>
                                            </tr>
                                    })}

                                        {noGuestsMsg && (
                                          <tr>
                                            <td colspan='5'>
                                            <div className='d-flex justify-content-center'>
                                                <div className='mb-0' role='alert'>
                                                    <div className='p-3'>
                                                        {noGuestsMsg}
                                                    </div>
                                                </div>
                                            </div>
                                            </td>
                                          </tr>
                                        )}
                                </tbody>
                            </table>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    ) : (
      
        <div className='row  g-0'>
            <div className='col-md-8'>

                <div className='d-flex w-100 justify-content-center'>
                    <div className='card w-100 mb-2'>
                        <div className='card-header' onClick={() =>{setIsEdit(false); setIsAdd(false); setIsDisplay(false);}}>
                          <div className='d-flex justify-content-between m-2'>
                            <h4>Guests</h4>
                            <div className='fs-5'>
                              {attendCount} guest{attendCount === 0 || attendCount === 1 ? '' : 's'} will attend.
                            </div>
                            {/* Add button */}
                            <div>
                              {(!isEdit && !isEditFg) && (
                                <div>
                                {!isAdd && (
                                    <button onClick={ handleClickAdd } className='btn btn-outline-success'>
                                        + Add a guest
                                    </button>
                                )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className='card-body p-3'>

                          <div className='table-responsive'>
                            <table className='table table-hover table-bordered table-sm w-100'>
                                <thead>
                                    <tr>
                                        <th><div className='text-center'>Guest</div></th>
                                        <th><div className='text-center'>Attend</div></th>
                                        <th><div className='text-center'>Allergy</div></th>
                                        <th><div className='text-center'>Other Information</div></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {guestList?.map((tbGuest, index) => {
                                            return <tr key={index}>
                                                <td className='text-break'>
                                                  <div  className='text-dark cursor-pointer ps-2'
                                                        style={{ cursor: 'pointer' }}
                                                        onMouseEnter={(e) => e.target.classList.replace('text-dark', 'text-primary')}
                                                        onMouseLeave={(e) => e.target.classList.replace('text-primary', 'text-dark')}
                                                        onClick={(event) => handleGuestDetail(event, tbGuest)}>
                                                    {tbGuest.guestName}{tbGuest.guestRelation ? ` (${tbGuest.guestRelation})` : ''}
                                                  </div>
                                                </td>
                                                <td>
                                                  <div  className={`text-center ${getButtonClass(tbGuest.fgAttend)}`}
                                                        onClick={(event) => handleEditFg(event, tbGuest)}>
                                                    {getButtonLabel(tbGuest.fgAttend)}
                                                  </div>
                                                </td>
                                                <td className=''>
                                                  <div className='text-center text-break'>
                                                    {tbGuest.guestAllergy || '-'}
                                                  </div>
                                                </td>
                                                <td className=''>
                                                  <div className='ps-2 text-break'>
                                                    {tbGuest.otherInfo}
                                                  </div>
                                                </td>
                                            </tr>
                                    })}

                                        {noGuestsMsg && (
                                          <tr>
                                            <td colspan='4'>
                                            <div className='d-flex justify-content-center'>
                                                <div className='mb-0' role='alert'>
                                                    <div className='p-3'>
                                                        {noGuestsMsg}
                                                    </div>
                                                </div>
                                            </div>
                                            </td>
                                          </tr>
                                        )}
                                </tbody>
                            </table>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-4'>
                <div>

                    <div className='d-flex flex-column w-100 justify-content-center'>

                        {/* card change atteng flag */}
                        {isEditFg? (
                            <div className='card w-100 ms-2'>
                              <div className='card-header'>
                                    <div className='d-flex flex-column justify-content-center'>
                                        <h4 className='text-center'>{guestValue.guestName}</h4>
                                        <div className='text-center'>
                                            {guestValue.guestRelation}
                                        </div>
                                    </div>
                              </div>
                              <div className='card-body'>
                                    <div className='form-check ms-2'>
                                      <input
                                        className='form-check-input'
                                        type='radio'
                                        name={`fgAttend_${guestValue.idGuest}`}
                                        id='fgAttend1'
                                        checked={guestValue.fgAttend === '1'}
                                        onChange={() => handleChange(guestValue.idGuest, 'fgAttend', '1')}
                                      />
                                      <label className='form-check-label' htmlFor='fgAttend1'>
                                        Attend
                                      </label>
                                    </div>

                                    <div className='form-check ms-2'>
                                      <input
                                        className='form-check-input'
                                        type='radio'
                                        name={`fgAttend_${guestValue.idGuest}`}
                                        id='fgAttend2'
                                        checked={guestValue.fgAttend === '2'}
                                        onChange={() => handleChange(guestValue.idGuest, 'fgAttend', '2')}
                                      />
                                      <label className='form-check-label' htmlFor='fgAttend2'>
                                        Can't attend
                                      </label>
                                    </div>

                                    <div className='form-check ms-2'>
                                      <input
                                        className='form-check-input'
                                        type='radio'
                                        name={`fgAttend_${guestValue.idGuest}`}
                                        id='fgAttend0'
                                        checked={guestValue.fgAttend === '0'}
                                        onChange={() => handleChange(guestValue.idGuest, 'fgAttend', '0')}
                                      />
                                      <label className='form-check-label' htmlFor='fgAttend0'>
                                        No answer
                                      </label>
                                    </div>

                                    {/* Update button*/}
                                    <span className='d-flex justify-content-end text-primary' style={{ cursor: 'pointer' }} 
                                          onClick={handleUpdateFg} >
                                        Update
                                    </span>
                              </div>
                            </div>
                        ) : (
                          <div>
                        {/* guest card */}
                        <div className='card w-100 ms-2'>
                            <div className='card-header'>
                              {/* error message */}
                              <div>
                                  {errValidation && (
                                      <div className='text-danger mb-2' style={{ whiteSpace: 'pre-wrap' }}>
                                          {errValidation}
                                      </div>
                                  )}
                              </div>

                              {/* dropdown child name */}
                              {isAdd ? (
                                <div>
                                  <div className='d-flex justify-content-center align-items-end'>
                                      <Dropdown>
                                          <Dropdown.Toggle variant='light' id='dropdown-basic'className='fs-6 mb-2 border' style={{ width: '200px' }}>
                                          {guestValue.guestName
                                                ? `${guestValue.guestName} (${guestValue.guestRelation || ''})` 
                                                : 'Past parties guests'}
                                          </Dropdown.Toggle>
            
                                          <Dropdown.Menu  style={{ width: '200px' }}>
                                              {allGuestList.map((guest) => (
                                                  <Dropdown.Item 
                                                      key={guest.id_guest} 
                                                      onClick={() => setGuestValue(guest)}>
                                                       {`${guest.guestName} (${guest.guestRelation || ''})`}
                                                  </Dropdown.Item>
                                              ))}
                                          </Dropdown.Menu>
                                      </Dropdown>
                                      <span onClick={handleReset} className='text-danger mt-3 me-2 p-2'  style={{ cursor: 'pointer' }}>
                                          Reset
                                      </span>
        
                                  </div>
                                      <label htmlFor='guestName'>Guest name:</label>
                                      <input id='guestName' type='text' placeholder='' className='form-control' value={guestValue.guestName}
                                          onChange={event => handleChange(guestValue.idGuest, 'guestName', event.target.value)}
                                      />
                                      <label htmlFor='guestRelation' className='mt-2'>Relation:</label>
                                      <input id='guestRelation' type='text' placeholder='' className='form-control' value={guestValue.guestRelation}
                                          onChange={event => handleChange(guestValue.idGuest, 'guestRelation', event.target.value)}
                                      />
                                  </div>

                              ) : (

                                <div>
                                  {isEdit ? (
                                    <div>
                                        <label htmlFor='guestName'>Guest name:</label>
                                        <input id='guestName' type='text' placeholder='' className='form-control' value={guestValue.guestName}
                                            onChange={event => handleChange(guestValue.idGuest, 'guestName', event.target.value)}
                                        />
                                        <label htmlFor='guestRelation' className='mt-2'>Relation:</label>
                                        <input id='guestRelation' type='text' placeholder='' className='form-control' value={guestValue.guestRelation}
                                            onChange={event => handleChange(guestValue.idGuest, 'guestRelation', event.target.value)}
                                        />
                                    </div>
                                  ) : (
                                    <div className='d-flex flex-column justify-content-center'>
                                        <h4 className='text-center'>{guestValue.guestName}</h4>
                                        <div className='text-center'>
                                            {guestValue.guestRelation}
                                        </div>
                                    </div>
                                  )}
                                </div>
                            )}
                            </div>
                            <div className='card-body p-4'>
                              <div>
                                  <div className={`${getButtonClass(guestValue.fgAttend)} fs-5 text-center`}>
                                      {getButtonLabel(guestValue.fgAttend)}
                                  </div>
                                <hr />
                                  <div>
                                      <label htmlFor='guestAllergy'>Allergy:</label>
                                      {(isEdit || isAdd) ? (
                                        <input id='guestAllergy' type='text' placeholder='' className='form-control' value={guestValue.guestAllergy}
                                            onChange={event => handleChange(guestValue.idGuest, 'guestAllergy', event.target.value)}
                                        />
                                      ) : (
                                        <p className='fs-5 ms-4 mt-1'>{guestValue.guestAllergy || <>&nbsp;</>}</p>
                                      )}
                                  </div>

                                  <div className='mb-2'>
                                      <label htmlFor='parentPhone'>Parents phone number:</label>
                                      {(isEdit || isAdd) ? (
                                        <input id='parentPhone' type='text' placeholder='' className='form-control' value={guestValue.parentPhone}
                                            onChange={event => handleChange(guestValue.idGuest, 'parentPhone', event.target.value)}
                                        />
                                      ) : (
                                        <p className='fs-5 ms-4 mt-1'>{guestValue.parentPhone || <>&nbsp;</>}</p>
                                      )}
                                  </div>
                                  <div className='mb-2'>
                                      <label htmlFor='parentEmail'>Parents E-mail:</label>
                                      {(isEdit || isAdd) ? (
                                        <input id='parentEmail' type='text' placeholder='' className='form-control' value={guestValue.parentEmail}
                                            onChange={event => handleChange(guestValue.idGuest, 'parentEmail', event.target.value)}
                                        />
                                      ) : (
                                        <p className='fs-5 ms-4 mt-1'>{guestValue.parentEmail || <>&nbsp;</>}</p>
                                      )}
                                  </div>

                                  <hr />
                                  <div>
                                      <label htmlFor='otherInfo' className='mt-0'>Other Information:</label>
                                      {(isEdit || isAdd) ? (
                                        <textarea id='otherInfo' type='text' placeholder='' className='form-control' value={guestValue.otherInfo}
                                            onChange={event => handleChange(guestValue.idGuest, 'otherInfo', event.target.value)}></textarea>
                                      ) : (
                                        <p className='ms-4 mt-1 mb-3'>{guestValue.otherInfo || <>&nbsp;</>}</p>
                                      )}
                                  </div>

                                  
                                  <div className='d-flex justify-content-end align-items-center mt-2'>
                                      {(isEdit || isAdd) && (
                                          <span onClick={handleCancel} className='text-danger me-3'  style={{ cursor: 'pointer' }}>
                                              Cancel
                                          </span>
                                      )}
                                      {/* Add button */}
                                      {isAdd ? (
                                          <button onClick={handleAdd} className='btn btn-outline-success'>
                                              Add
                                          </button>
                                      ) : (
                                        <div>
                                           {/* Edit Delete button*/}
                                            <span className='text-primary me-3' style={{ cursor: 'pointer' }} 
                                                onClick={ isEdit ? handleUpdate : handleEdit }>
                                                {isEdit ? 'Update' : 'Edit'}
                                            </span>
                                            <span onClick={handleDelete} className='text-danger' style={{ cursor: 'pointer' }} >
                                                Delete
                                            </span>
                                        </div>
                                      )}
                                  </div>
                              </div>
                            </div>
                        </div>
                       </div>
                      )}
                    </div>
                </div>
            </div>
        </div>
      ) }
    </div>
  )
}

export default Guest