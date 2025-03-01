import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {Dropdown, Form } from 'react-bootstrap';
import Todo from './Todo';
import Shopping from './Shopping';
import Guest from './Guest';
import Invitation from './Invitation';


function Party() {
    const { userId } = useUser();

    const location = useLocation();
    const childList = location.state?.childList || [];
    const partyData = location.state?.partyData || {};

    const [childListCopy, setChildListCopy] = useState(childList);
    const [selectedChildName, setSelectedChildName] = useState(''); // dropdown child name
    const [selectedChildId, setSelectedChildId] = useState(''); // dropdown child id
    const [selectedYear, setSelectedYear] = useState('');// dropdown year
    const [selectedParty, setSelectedParty] = useState('');// dropdown year choise -> party id set
    const [yearList, setYearList] = useState([]); 
    const [partyList, setPartyList] = useState([]);
    const [noPartiesMsg, setNoPartiesMsg] = useState(''); 
    const [errValidation, setErrValidation] = useState([]);

    const [partyValue, setPartyValue] = useState({
        idParty: '',
        idChild: '',
        partyDate: '',
        partyTimeFrom: '',
        partyTimeTo: '',
        partyPlace: '',
        partyPlace2: '',
        partyPlace3: '',
        partyContact1: '',
        partyContact2: '',
        childName: ''
    });

    const [valueChild, setValueChild] = useState({
        id_parent: userId,
        child_name: '',
        child_birthday: ''
    });

    const [isAdd, setIsAdd] = useState(false);
    const [isAddChild, setIsAddChild] = useState(false);
    const [errValidationChild, setErrValidationChild] = useState([]);

    useEffect(() => {
        if (selectedParty) {
            setSelectedParty(selectedParty);
        } else {
            if (!selectedChildName) {
                setSelectedParty(partyData.idParty || '');
                setSelectedChildName(partyData.childName || '');
                setSelectedChildId(partyData.idChild || '');
                setSelectedYear(partyData.childYears || '');
                const selectedChildData = childListCopy.find(child => child.id_child === partyData.idChild);
                const parties = selectedChildData.child_parties.map(party => ({...party, isEdit: false}));
                setYearList(selectedChildData.child_parties);
                setPartyList(parties);
            }
        }
    }, [selectedParty, partyData, childList, partyList]);


    const handleSelect = (childData) => {
        setSelectedChildName(childData.child_name);
        setSelectedChildId(childData.id_child);

        if (childData.child_parties && childData.child_parties.length > 0) {
            setYearList(childData.child_parties);
            setPartyList(childData.child_parties);
            setNoPartiesMsg('');
        } else {
            setYearList([]);
            setPartyList([]);
            if(!isAdd) {
                setNoPartiesMsg('No parties found for this child.');
            }
        }

        setSelectedYear('');
        setSelectedParty('');
    };

    const handleSelectYear = (party) => {
        setSelectedYear(party.childYears);
        setSelectedParty(party.idParty);
    }


    const handleEdit = (event, partyId) => {
        event.preventDefault();
        // 現在のpartyListから対象のpartyデータを取得
        const targetParty = partyList.find(party => party.idParty === partyId);

        if (!targetParty) return;

        // 既存の値を保持しながら、変更された値だけを更新
        setPartyValue({ ...targetParty });
        setPartyList(partyList.map(party =>
            party.idParty === partyId ? {...party, isEdit: true} : party
        ));
    };


    const handleChange = (partyId, field, value) => {
        setPartyValue({ ...partyValue, [field]: value});
        setPartyList(partyList.map(party =>
            party.idParty === partyId ? {...party, [field]: value} : party
        ));

    };

    const handleCancel = (partyId) => {
        setPartyValue({
            idParty: '',
            idChild: '',
            partyDate: '',
            partyTimeFrom: '',
            partyTimeTo: '',
            partyPlace: '',
            partyPlace2: '',
            partyPlace3: '',
            partyContact1: '',
            partyContact2: '',
            childName: ''
            });

        setIsAdd(false);
        setSelectedYear('');
        setSelectedParty('');
        setErrValidation([]);

        if (partyId) {
            setPartyList(partyList.map(party =>
                party.idParty === partyId ? {...party, isEdit: false} : party
            ));
        }
    }

    const handleAdd = (event) => {
        event.preventDefault();
        setErrValidation([]);

            axios.post('http://localhost:5000/party/insert', {...partyValue, 'userId': userId, 'idChild': selectedChildId })
            .then(res => {
                const childData = res.data.parties.map(child => ({
                    ...child,
                    child_parties: child.child_parties.map(party => ({...party, isEdit: false}))
                }));
                const targetChild = childData.find(child => child.id_child === selectedChildId);

                setPartyList(targetChild.child_parties);
                setYearList(targetChild.child_parties);

                setSelectedParty(res.data.insertedUuid);
                const year = targetChild.child_parties.find(party => party.idParty === res.data.insertedUuid)
                setSelectedYear(year.childYears);

                setPartyValue({
                    idParty: '',
                    idChild: '',
                    partyDate: '',
                    partyTimeFrom: '',
                    partyTimeTo: '',
                    partyPlace: '',
                    partyPlace2: '',
                    partyPlace3: '',
                    partyContact1: '',
                    partyContact2: '',
                    childName: ''
                    });

                setIsAdd(false);
                setErrValidation([]);
            })
            .catch((err) => {
                if (err.response && err.response.data.errors) {
                  setErrValidation(err.response.data.errors.join('\n'));
                  console.log('validerr:',  err.response.data.errors);
                } else {
                  console.error("Error insert child:", err);
                }
            })

    }


    const handleCancelChild = () => {
        setValueChild({
            id_parent: userId,
            child_name: '',
            child_birthday: ''
        });
        setIsAddChild(false);
        setErrValidationChild([]);
    }

    const handleAddChild = (event) => {
        event.preventDefault();
        setErrValidationChild([]);
        // console.log("Adding child with valueChild:", valueChild);
        if (!valueChild.child_name) {
            setErrValidationChild(['Child name is required.']);
        } else {
            axios.post('http://localhost:5000/child/insert', {...valueChild, id_parent: userId})
            .then(res => {
              const childData = res.data.parties.map(child => ({...child, isEdit: false}));
              setChildListCopy(childData);

              setValueChild([]);
              setIsAddChild(false);
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




    const handleUpdate = (event, partyId) => {
        event.preventDefault();
        setErrValidation([]);

        const updatedValues = { ...partyValue };
        // console.log('updatedValues', updatedValues);

        axios.put(`http://localhost:5000/party/update/${partyId}`, {...updatedValues,  'userId': userId })
        .then(res => {
            // console.log("Party updated successfully:", res.data);
            setPartyList(partyList.map(party =>
                party.idParty === partyId ? {...party, isEdit: false} : party
            ));

            setPartyValue({
                partyId: '',
                partyDate: '',
                partyTimeFrom: '',
                partyTimeTo: '',
                partyPlace: '',
                partyPlace2: '',
                partyPlace3: '',
                partyContact1: '',
                partyContact2: '',
                childName: ''
            });
            setErrValidation([]);
        })
        .catch((err) => {
            if (err.response && err.response.data.errors) {
              setErrValidation(err.response.data.errors.join('\n'));
              console.log('validerr:',  err.response.data.errors);
            } else {
              console.error("Error insert child:", err);
            }
        })
  };


    const handleDelete = (event, partyId) => {
        event.preventDefault();
        console.log('delete party party id: ', partyId);
        const isConfirmed = confirm('Your guest list, ToDo list, shopping list and invitations will also be deleted.');

        if(isConfirmed) {
            axios.delete(`http://localhost:5000/party/delete/${partyId}`, {data: { userId: userId }})
            .then(res => {
                if (res.data.length !== 0) {
                    const childData = res.data.parties.map(child => ({
                        ...child,
                        child_parties: child.child_parties.map(party => ({...party, isEdit: false}))
                    }));
                    const targetChild = childData.find(child => child.id_child === selectedChildId);
                    // console.log('delete', targetChild.child_parties);
                    setPartyList(targetChild.child_parties);
                    setYearList(targetChild.child_parties);
                    setSelectedParty('');
                    setSelectedYear('');

                } else {
                    setPartyList([]);  
                }
            })
            .catch(err => console.log(err));
        } else {
            return;   
        }
    };



  return (

    <div>
      
      <div className='container mt-5'> 
        <div className='row'>
            <div className='col'>

                {/* button add new child */}
                <div className=''>
                    {!isAddChild && (
                        <button onClick={() => {setIsAddChild(true); setNoPartiesMsg('');}} className='btn btn-outline-success btn-sm fs-6 text ms-4 m-2 p-2'
                            style={{ width: '200px' }}>
                            + Add a new child
                        </button>
                    )}
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                {/* dropdown select child, year */}
                <div className='d-flex justify-content-center'>
                    <Dropdown className='me-4'>
                        <Dropdown.Toggle variant='light border' id='dropdown-basic' style={{ width: '200px' }}>
                            {selectedChildName || 'Select Child'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu  style={{ width: '200px' }}>
                            {childListCopy.map((child) => (
                                <Dropdown.Item 
                                    key={child.id_child} 
                                    onClick={() => handleSelect(child)}>
                                    {child.child_name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle variant='light border' id='dropdown-basic' style={{ width: '200px' }}>
                            {selectedYear ? `${selectedYear} years old` : 'Select year'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu  style={{ width: '200px' }}>
                            {yearList.map((party) => (
                                <Dropdown.Item 
                                    key={party.idParty} 
                                    onClick={() => handleSelectYear(party)}>
                                    {party.childYears} years old
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div className='row'>
            {/* button add new party */}
            <div className='mt-3'>
                {!isAddChild && (
                    <div>
                        {isAdd ? (
                            <button onClick={handleCancel} className='btn btn-outline-danger btn-sm text ms-4 p-2'
                                    style={{ width: '150px' }}>
                                Cancel addition
                            </button>
                        ) : (
                            <button onClick={() => {setIsAdd(true); setNoPartiesMsg('');} }
                                    className='btn btn-outline-success btn-sm fs-5 text ms-4 mb-3 p-2'
                                    style={{ width: '200px' }}>
                                + Add a new party
                            </button>
                        )}
                        </div>
                )}
            </div>
        </div>

    </div>

      {noPartiesMsg ? (
            <div>
                <div className="alert alert-warning" role="alert">
                    <div className='d-flex justify-content-center'>
                        {noPartiesMsg}
                    </div>
                </div>
            </div>
        ) : (
            <div className='container mt-3'> 
                <div className='row  g-0'>
                    <div className='col-md-3'>

                        <div className='d-flex flex-column mt-1'>
                            <div  className='w-100 bg-white rounded p-3 '>

                                {/* add new child card*/}
                                {isAddChild ? (
                                    <form>

                                        {/* error message */}
                                        <div>
                                            {errValidationChild && (
                                                <div className='text-danger mb-2 ms-2' style={{ whiteSpace: 'pre-wrap' }}>
                                                    {errValidationChild}
                                                </div>
                                            )}
                                        </div>

                                        <div className='card mb-2'>
                                        <div className='card-header mb-2'>

                                            <div className='d-flex flex-column'>
                                            <label className='me-2'>Child name:</label>
                                            <input type='text' placeholder='Child name' className='form-control' value={valueChild.child_name}
                                                    onChange={event => setValueChild({...valueChild, 'child_name': event.target.value})} required/>
                                            </div>
                                        </div>
                                        <div className='card-body flex-grow-1'>
                                            <div className='mb-2'>

                                            <Form.Group>
                                                <Form.Label>Birthday:</Form.Label>
                                                <Form.Control
                                                    type='date'
                                                    value={valueChild.child_birthday}
                                                    onChange={event => (setValueChild({...valueChild, 'child_birthday': event.target.value}))}
                                                    required
                                                />
                                            </Form.Group>

                                            </div>
                                            <div className='d-flex justify-content-end'>
                                            <span onClick={handleCancelChild} className='text-danger btn-sm ms-4 p-2'
                                                    style={{ width: '150px' }}>
                                                Cancel addition
                                            </span>
                                            <button onClick={  handleAddChild } className='btn btn-outline-success btn-sm'>
                                                Add
                                            </button>
                                        </div>
                                        </div>
                                        </div>
                                    </form>
                                ) : (

                                    <div>
                                        {/* new party form */}
                                        {isAdd ? (
                                            <div>
                                                {/* error message */}
                                                <div>
                                                    {errValidation && (
                                                        <div className='text-danger mb-4 ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                                                            {errValidation}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='card mb-2'>
                                                    <div className='card-header p-3'>
                                                        <div className='d-flex flex-column'>


                                                            {/* dropdown child name */}
                                                            <Dropdown className='d-flex justify-content-center'>
                                                                <Dropdown.Toggle variant='light border' id='dropdown-basic'className='fs-5' style={{ width: '200px' }}>
                                                                    {selectedChildName || 'Select Child'}
                                                                </Dropdown.Toggle>

                                                                <Dropdown.Menu  style={{ width: '200px' }}>
                                                                    {childListCopy.map((child) => (
                                                                        <Dropdown.Item 
                                                                            key={child.id_child} 
                                                                            onClick={() => handleSelect(child)}>
                                                                            {child.child_name}
                                                                        </Dropdown.Item>
                                                                    ))}
                                                                </Dropdown.Menu>
                                                            </Dropdown>

                                                        </div>
                                                    </div>
                                                    <div className='card-body flex-grow-1'>
                                                        <div>
                                                            <Form.Group>
                                                                <Form.Label>Date:</Form.Label>
                                                                <Form.Control
                                                                    type='date'
                                                                    value={partyValue.partyDate || new Date().toISOString().split('T')[0]}
                                                                    onChange={event => handleChange(selectedParty, 'partyDate', event.target.value)}
                                                                />
                                                                <Form.Label className='mt-2'>From:</Form.Label>
                                                                <Form.Select
                                                                    type='time'
                                                                    value={partyValue.partyTimeFrom || '14:00'}
                                                                    onChange={(event) => handleChange(selectedParty, 'partyTimeFrom', event.target.value)}
                                                                >
                                                                    {[...Array(24)].map((_, hour) => (
                                                                        [...Array(4)].map((_, min) => {
                                                                            const time = `${String(hour).padStart(2, '0')}:${String(min * 15).padStart(2, '0')}`;
                                                                            return <option key={time} value={time}>{time}</option>;
                                                                        })
                                                                    ))}
                                                                </Form.Select>

                                                                <Form.Label className='mt-2'>To:</Form.Label>
                                                                <Form.Select
                                                                    type='time'
                                                                    value={partyValue.partyTimeTo || '17:00'}
                                                                    onChange={(event) => handleChange(selectedParty, 'partyTimeTo', event.target.value)}
                                                                >
                                                                    {[...Array(24)].map((_, hour) => (
                                                                        [...Array(4)].map((_, min) => {
                                                                            const time = `${String(hour).padStart(2, '0')}:${String(min * 15).padStart(2, '0')}`;
                                                                            return <option key={time} value={time}>{time}</option>;
                                                                        })
                                                                    ))}
                                                                </Form.Select>
                                                            </Form.Group>

                                                            
                                                            <label  className='mt-2' htmlFor='partyPlace'>Location: </label>
                                                            <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyValue.partyPlace}
                                                                onChange={event => handleChange(selectedParty, 'partyPlace', event.target.value)} />
                                                            <input id='partyPlace2' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace2}
                                                                onChange={event => handleChange(selectedParty, 'partyPlace2', event.target.value)} />
                                                            <input id='partyPlace3' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace3}
                                                                onChange={event => handleChange(selectedParty, 'partyPlace3', event.target.value)} />

                                                            {/* <label  className='mt-2' htmlFor='partyContact1'>Contact1: </label>
                                                            <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyValue.partyContact1}
                                                                onChange={event => handleChange(selectedParty, 'partyContact1', event.target.value)} />

                                                            <label  className='mt-2' htmlFor='partyContact2'>Contact2: </label>
                                                            <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyValue.partyContact2}
                                                                onChange={event => handleChange(selectedParty, 'partyContact2', event.target.value)} /> */}
                                                        </div>
                                                        <div className='d-flex justify-content-end'>

                                                            <span onClick={handleCancel} className='text-danger mt-3 me-2 p-2'  style={{ cursor: 'pointer' }}>
                                                                Cancel
                                                            </span>

                                                            <button onClick={ handleAdd } className='btn btn-outline-success mt-3'>
                                                                Add
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Party Cards */}
                                                {partyList
                                                    ?.filter((partyInfo) => !selectedYear || partyInfo.idParty === selectedParty)
                                                    .map((partyInfo) => (
                                                        <div className='card mb-2' onClick={() => {handleSelectYear(partyInfo)}}>
                                                            <div className='card-header p-3'>
                                                                <div className='d-flex justify-content-center align-items-end'>
                                                                    <div className='fs-3 me-4'>{partyInfo.childName}</div>
                                                                    <div className='fs-5'>{partyInfo.childYears} years old</div>
                                                                </div>
                                                            </div>
                                                            <div className='card-body p-4'>
                                                                
                                                                {/* Edit party */}
                                                                {partyInfo.isEdit ? (
                                                                    <div>
                                                                        <Form.Group>
                                                                            <Form.Label className='mb-0'>Date:</Form.Label>
                                                                            <Form.Control
                                                                                type='date'
                                                                                value={partyInfo.partyDate}
                                                                                onChange={event => handleChange(partyInfo.idParty, 'partyDate', event.target.value)}
                                                                            />
                                                                            <Form.Label className='mt-1 mb-0'>From:</Form.Label>
                                                                            <Form.Select
                                                                                type='time'
                                                                                value={partyInfo.partyTimeFrom}
                                                                                onChange={(event) => handleChange(partyInfo.idParty, 'partyTimeFrom', event.target.value)}
                                                                            >
                                                                                {[...Array(24)].map((_, hour) => (
                                                                                    [...Array(4)].map((_, min) => {
                                                                                        const time = `${String(hour).padStart(2, '0')}:${String(min * 15).padStart(2, '0')}`;
                                                                                        return <option key={time} value={time}>{time}</option>;
                                                                                    })
                                                                                ))}
                                                                            </Form.Select>

                                                                            <Form.Label className='mt-1 mb-0'>To:</Form.Label>
                                                                            <Form.Select
                                                                                type='time'
                                                                                value={partyInfo.partyTimeTo}
                                                                                onChange={(event) => handleChange(partyInfo.idParty, 'partyTimeTo', event.target.value)}
                                                                            >
                                                                                {[...Array(24)].map((_, hour) => (
                                                                                    [...Array(4)].map((_, min) => {
                                                                                        const time = `${String(hour).padStart(2, '0')}:${String(min * 15).padStart(2, '0')}`;
                                                                                        return <option key={time} value={time}>{time}</option>;
                                                                                    })
                                                                                ))}
                                                                            </Form.Select>
                                                                        </Form.Group>

                                                                        
                                                                        <label className='me-3 mt-1' htmlFor='partyPlace'>Location: </label>
                                                                        <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyInfo.partyPlace}
                                                                            onChange={event => handleChange(partyInfo.idParty, 'partyPlace', event.target.value)} />
                                                                        <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyInfo.partyPlace2}
                                                                            onChange={event => handleChange(partyInfo.idParty, 'partyPlace2', event.target.value)} />
                                                                        <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyInfo.partyPlace3}
                                                                            onChange={event => handleChange(partyInfo.idParty, 'partyPlace3', event.target.value)} />
{/*         
                                                                        <label className='me-3 mt-1' htmlFor='partyContact1'>Contact1: </label>
                                                                        <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyInfo.partyContact1}
                                                                            onChange={event => handleChange(partyInfo.idParty, 'partyContact1', event.target.value)} />

                                                                        <label className='me-3 mt-1' htmlFor='partyContact2'>Contact2: </label>
                                                                        <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyInfo.partyContact2}
                                                                            onChange={event => handleChange(partyInfo.idParty, 'partyContact2', event.target.value)} /> */}

                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <div>Date:</div>
                                                                        <div className='fs-5 d-flex justify-content-center'> {partyInfo.partyDate}</div>
                                                                        <div className='fs-6 d-flex justify-content-center'>{partyInfo.partyTimeFrom || <>&nbsp;</>} ~ {partyInfo.partyTimeTo}</div>
                                                                        <div className='mt-1'>Location:</div>
                                                                            <div className='fs-5 d-flex flex-column justify-content-center'>
                                                                                <div>
                                                                                    {partyInfo.partyPlace || <>&nbsp;</>}
                                                                                </div>
                                                                                <div>
                                                                                    {partyInfo.partyPlace2 || <>&nbsp;</>}
                                                                                </div>
                                                                                <div>
                                                                                    {partyInfo.partyPlace3 || <>&nbsp;</>}
                                                                                </div>
                                                                            </div>
                                                                        {/* <div className='mt-1'>Contact1:</div>
                                                                        <div className='fs-5 d-flex justify-content-center'>
                                                                            {partyInfo.partyContact1 || <>&nbsp;</>}
                                                                        </div>
                                                                        <div className='mt-1'>Contact2:</div>
                                                                        <div className='fs-5 d-flex justify-content-center'>
                                                                            {partyInfo.partyContact2 || <>&nbsp;</>}
                                                                        </div> */}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Edit Delete */}
                                                            <div className='d-flex justify-content-end mb-3 me-2'>
                                                                {partyInfo.isEdit && (
                                                                    <span onClick={() => {handleCancel(partyInfo.idParty)}} className='text-danger me-3'  style={{ cursor: 'pointer' }}>
                                                                        Cancel
                                                                    </span>
                                                                )}
                                                                {new Date(partyInfo.partyDate) > new Date() && (
                                                                    <span className='text-primary me-3' style={{ cursor: 'pointer' }} 
                                                                        onClick={ (event) => {
                                                                            partyInfo.isEdit ? handleUpdate(event, partyInfo.idParty) : handleEdit(event,partyInfo.idParty);}}>
                                                                        {partyInfo.isEdit ? 'Update' : 'Edit'}
                                                                    </span>
                                                                )}
                                                                <span onClick={(event) => handleDelete(event, partyInfo.idParty)} className='text-danger me-3' style={{ cursor: 'pointer' }} >
                                                                    Delete
                                                                </span>
                                                            </div>

                                                        </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>            
                                )}
                            </div>
                        </div>
            
                    </div>
                    <div className='col-md-9'>
                            {!isAdd && (
                                <div>
                                    {selectedYear && (
                                        <div>
                                            <Guest partyId={selectedParty} childId={selectedChildId}/>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
                <div className='row g-0'>
                <div className='col-md-4'>
                    {!isAdd && (
                            <div>
                                {selectedYear && (
                                    <div>
                                        <Invitation partyId={selectedParty} />
                                    </div>
                                )}
                            </div>
                    )}
                </div>
                    <div className='col-md-4'>
                        {!isAdd && (
                            <div>
                                {selectedYear && (
                                    <div>
                                        <Todo partyId={selectedParty} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='col-md-4'>
                        {!isAdd && (
                            <div>
                                {selectedYear && (
                                    <div>
                                        <Shopping partyId={selectedParty} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        )}
    </div>
  )
}

export default Party
