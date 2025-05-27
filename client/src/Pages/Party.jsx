import React, { useEffect, useState } from 'react';
import { useUser } from '../Components/UserContext';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Dropdown, Form } from 'react-bootstrap';
import Todo from '../Components/Todo';
import Shopping from '../Components/Shopping';
import Guest from '../Components/Guest';
import Invitation from '../Components/Invitation';


function Party() {
    const { userId } = useUser();

    const location = useLocation();
    const { partyId } = location.state || {};
    const { childId } = location.state || {};
    const { childName } = location.state || {};
    const { fgAdd } = location.state || false;

    const [childList, setChildList] = useState([]);
    const [selectedChildName, setSelectedChildName] = useState(childName); // dropdown child name
    const [selectedChildId, setSelectedChildId] = useState(childId); // dropdown child id
    const [selectedYear, setSelectedYear] = useState('');// dropdown year
    const [selectedParty, setSelectedParty] = useState(partyId);// dropdown year choise -> party id set
    const [yearList, setYearList] = useState([]); 
    const [partyList, setPartyList] = useState([]);
    const [noPartiesMsg, setNoPartiesMsg] = useState(''); 
    const [errValidation, setErrValidation] = useState([]);

    const [partyValue, setPartyValue] = useState({
        idParty: '',
        idChild: '',
        partyDate: '',
        partyDate2: '',
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

    const [isAdd, setIsAdd] = useState(fgAdd);
    const [isAddChild, setIsAddChild] = useState(false);
    const [errValidationChild, setErrValidationChild] = useState([]);


    useEffect(() => {
        if (userId) {
          axios.get(`http://localhost:5000/child/selectChildParty/`, {params: { userId: userId }})
            .then(res => {
              if (res.data.length !== 0) {
                // console.log(res.data);
                const childData = res.data.parties.map(child => ({
                  ...child, isEdit: false
                }));
                setChildList(childData);

                if (selectedChildId) {
                    const selectedChild = childData.find(child => child.id_child === selectedChildId);
                    if (selectedChild.child_parties && selectedChild.child_parties.length > 0) {
                        setYearList(selectedChild.child_parties);
                        setPartyList(selectedChild.child_parties);
                        setNoPartiesMsg('');
                    }else {
                        setYearList([]);
                        setPartyList([]);
                        setNoPartiesMsg('No parties found for this child.');
                    }
                }
              } else {
                setChildList([]);  
              }
            })
            .catch(err => console.log(err))
          } else {
            setChildList([]);
          }

        if(fgAdd) {
            handleAddParty();
        }

    }, [userId]);


    useEffect(() => {
        if (selectedParty && childList.length > 0) {
            const selectedChild = childList.find(child =>
                child.child_parties?.some(party => party.idParty === selectedParty)
            );
    
            if (selectedChild) {
                setSelectedChildName(selectedChild.child_name);
                setSelectedChildId(selectedChild.id_child);
                setYearList(selectedChild.child_parties);
                setPartyList(selectedChild.child_parties);
    
                const foundParty = selectedChild.child_parties.find(party => party.idParty === selectedParty);
                if (foundParty) {
                    setSelectedYear(foundParty.childYears);
                    setSelectedParty(foundParty.idParty);
                    setPartyValue({
                        idParty: foundParty.idParty,
                        idChild: foundParty.idChild,
                        partyDate: foundParty.partyDate,
                        partyDate2: foundParty.partyDate2,
                        partyTimeFrom: foundParty.partyTimeFrom,
                        partyTimeTo: foundParty.partyTimeTo,
                        partyPlace: foundParty.partyPlace,
                        partyPlace2: foundParty.partyPlace2,
                        partyPlace3: foundParty.partyPlace3,
                        partyContact1: foundParty.partyContact1,
                        partyContact2: foundParty.partyContact2,
                        childName: foundParty.childName,
                        childYears: foundParty.childYears
                    })
                }
            }
        }
    }, [selectedParty, childList]);


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
        setPartyValue({});
    };

    const handleSelectYear = (partyInfo) => {
        setSelectedYear(partyInfo.childYears);
        setSelectedParty(partyInfo.idParty);
        setPartyValue({
            idParty: partyInfo.idParty,
            idChild: partyInfo.idChild,
            partyDate: partyInfo.partyDate,
            partyDate2: partyInfo.partyDate2,
            partyTimeFrom: partyInfo.partyTimeFrom,
            partyTimeTo: partyInfo.partyTimeTo,
            partyPlace: partyInfo.partyPlace,
            partyPlace2: partyInfo.partyPlace2,
            partyPlace3: partyInfo.partyPlace3,
            partyContact1: partyInfo.partyContact1,
            partyContact2: partyInfo.partyContact2,
            childName: partyInfo.childName,
            childYears: partyInfo.childYears
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
              setChildList(childData);

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


    const handleEdit = (event, partyId) => {
        event.preventDefault();
        // 現在のpartyListから対象のpartyデータを取得
        const targetParty = partyList.find(party => party.idParty === partyId);

        if (!targetParty) return;

        // 既存の値を保持しながら、変更された値だけを更新
        setPartyValue({ ...targetParty, isEdit: true });
        setPartyList(partyList.map(party =>
            party.idParty === partyId ? {...party, isEdit: true} : party
        ));
    };


    const handleAddParty = () => {

        setIsAdd(true);
        setSelectedParty('');
        setNoPartiesMsg('');
        setPartyValue({
            partyDate: new Date().toISOString().split('T')[0],
            partyTimeFrom: '14:00',
            partyTimeTo: '17:00',
        });
    }

    const handleChange = (field, value) => {
        setPartyValue({ ...partyValue, [field]: value});
    };

    const handleCancel = (partyId) => {

        if(isAdd) {
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
        }

        setErrValidation([]);
        setIsAdd(false);

        if (partyId) {
            setPartyValue({ ...partyValue, isEdit: false });
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
                setChildList(childData);
                const targetChild = childData.find(child => child.id_child === selectedChildId);

                setPartyList(targetChild.child_parties);
                setYearList(targetChild.child_parties);

                setSelectedParty(res.data.insertedUuid);
                const targetParty = targetChild.child_parties.find(party => party.idParty === res.data.insertedUuid)
                setSelectedYear(targetParty.childYears);

                setPartyValue({
                    idParty: targetParty.idParty,
                    idChild: targetParty.idChild,
                    partyDate: targetParty.partyDate,
                    partyDate2: targetParty.partyDate2,
                    partyTimeFrom: targetParty.partyTimeFrom,
                    partyTimeTo: targetParty.partyTimeTo,
                    partyPlace: targetParty.partyPlace,
                    partyPlace2: targetParty.partyPlace2,
                    partyPlace3: targetParty.partyPlace3,
                    partyContact1: targetParty.partyContact1,
                    partyContact2: targetParty.partyContact2,
                    childName: targetParty.childName,
                    childYears: targetParty.childYears
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


    const handleUpdate = (event, partyId) => {
        event.preventDefault();
        setErrValidation([]);

        const updatedValues = { ...partyValue };

        axios.put(`http://localhost:5000/party/update/${partyId}`, {...updatedValues,  'userId': userId })
        .then(res => {
            console.log("Party updated successfully:", res.data);
            if (res.data.length !== 0) {
                // console.log(res.data);
                const childData = res.data.parties.map(child => ({
                  ...child, isEdit: false
                }));
                setChildList(childData);
              } else {
                setChildList([]);  
              }

            const childData = res.data.parties.map(child => ({
                ...child,
                child_parties: child.child_parties.map(party => ({...party, isEdit: false}))
            }));
            const targetChild = childData.find(child => child.id_child === selectedChildId);

            setPartyList(targetChild.child_parties);
            setYearList(targetChild.child_parties);      

            setPartyValue({
                partyId: '',
                partyDate: '',
                partyDate2: '',
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
            axios.put(`http://localhost:5000/party/delete/${partyId}`, { userId: userId })
            .then(res => {
                if (res.data.length !== 0) {
                        const childData = res.data.parties.map(child => ({
                            ...child,
                            child_parties: child.child_parties.map(party => ({...party, isEdit: false}))
                        }));
                        setChildList(childData);

                        const targetChild = childData.find(child => child.id_child === selectedChildId);
                        handleSelect(targetChild);
                    } else {
                        setChildList([]);  
                    }
            })
            .catch(err => console.log(err));
        } else {
            return;   
        }
    };


    return (
        <div>
            <nav aria-label='breadcrumb' className='ms-5 mt-4 mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item'><Link to='/'>Home</Link></li>
                    <li className='breadcrumb-item active' aria-current='page'>Party</li>
                    <li className='breadcrumb-item'><Link to='/createcard' state={{ partyId: selectedParty }}>Create Invitations</Link></li>
                </ol>
            </nav>
            <div className='container mt-5'> 
                <div className='row'>
                    <div className='col'>
                        {/* dropdown select child, year */}
                        <div className='d-flex justify-content-center'>
                            <Dropdown className='me-4'>
                                <Dropdown.Toggle variant='light border' id='dropdown-basic' style={{ width: '200px' }}>
                                    {selectedChildName || 'Select Child'}
                                </Dropdown.Toggle>
            
                                <Dropdown.Menu  style={{ width: '200px' }}>
                                    {childList.map((child) => (
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
                    <div className='col'>
                        {/* button add new child */}
                        <div className=''>
                            {!isAddChild ? (
                                <span onClick={() => {setIsAddChild(true); setNoPartiesMsg('');}} className='text-success m-5' style={{ cursor: 'pointer' }}>
                                    Add a new child
                                </span>
                            ) : (
                                <div>
                                    <form>

                                        {/* error message */}
                                        <div>
                                            {errValidationChild && (
                                                <div className='text-danger mb-2 ms-2' style={{ whiteSpace: 'pre-wrap' }}>
                                                    {errValidationChild}
                                                </div>
                                            )}
                                        </div>

                                        <div className='card mb-2' style={{ width: '18rem' }}>
                                        <div className='card-header mb-2'>

                                            <div className='d-flex flex-column'>
                                            <label className='me-2'></label>
                                            <input type='text' placeholder="Child's name" className='form-control' value={valueChild.child_name}
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
                                            <div className='d-flex justify-content-end mt-3'>
                                            <span onClick={handleCancelChild} className='text-danger me-3'>
                                                Cancel
                                            </span>
                                            <button onClick={  handleAddChild } className='btn btn-outline-success btn-sm'>
                                                Add
                                            </button>
                                        </div>
                                        </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {/* button add new party */}
                    <div className='mt-3'>
                        {!isAddChild && (
                            <div>
                                {!isAdd && (
                                    <button onClick={handleAddParty}
                                            className='btn btn-outline-success text ms-4 mb-3 p-2'
                                            style={{ width: '150px' }}>
                                        Add a new party
                                    </button>
                                )}
                                </div>
                        )}
                    </div>
                    <div>
                        {noPartiesMsg && (
                            <div className="alert alert-warning mt-4" role="alert">
                                <div className='d-flex justify-content-center'>
                                    {noPartiesMsg}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {!selectedParty ? (
                    <div>
                        <div className='row'>
                            <div className='col'>
                                {/* new party form */}
                                {isAdd ? (
                                    <div>

                                        <div className='card mb-2' style={{ width: '20rem' }}>
                                            <div className='card-header p-3'>
                                                <div className='d-flex flex-column'>
                                        {/* error message */}
                                        <div>
                                            {errValidation && (
                                                <div className='text-danger mb-4 ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                                                    {errValidation}
                                                </div>
                                            )}
                                        </div>

                                                    {/* dropdown child name */}
                                                    <Dropdown className='d-flex justify-content-center'>
                                                        <Dropdown.Toggle variant='light border' id='dropdown-basic'className='fs-5' style={{ width: '200px' }}>
                                                            {selectedChildName || 'Select Child'}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu  style={{ width: '200px' }}>
                                                            {childList.map((child) => (
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
                                                            value={partyValue.partyDate}
                                                            onChange={event => handleChange('partyDate', event.target.value)}
                                                        />
                                                        <Form.Label className='mt-2'>From:</Form.Label>
                                                        <Form.Select
                                                            type='time'
                                                            value={partyValue.partyTimeFrom}
                                                            onChange={(event) => handleChange('partyTimeFrom', event.target.value)}
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
                                                            value={partyValue.partyTimeTo}
                                                            onChange={(event) => handleChange('partyTimeTo', event.target.value)}
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
                                                        onChange={event => handleChange('partyPlace', event.target.value)} />
                                                    <input id='partyPlace2' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace2}
                                                        onChange={event => handleChange('partyPlace2', event.target.value)} />
                                                    <input id='partyPlace3' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace3}
                                                        onChange={event => handleChange('partyPlace3', event.target.value)} />
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
                                    <div className='d-flex flex-wrap'>
                                        {/* Party Cards */}
                                        {partyList
                                            // ?.filter((partyInfo) => !selectedParty || partyInfo.idParty === selectedParty)
                                            ?.map((partyInfo) => (
                                                <div className='card mt-4 m-3' style={{ width: '18rem' }}>
                                                    <div className='card-header p-3' onClick={() => {handleSelectYear(partyInfo)}} style={{ cursor: 'pointer' }} >
                                                        <div className='d-flex justify-content-center align-items-end'>
                                                            <div className='fs-3 me-4'>{partyInfo.childName}</div>
                                                            <div className='fs-5'>{partyInfo.childYears} years old</div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body p-4'>
                                                        {/* Edit party */}
                                                        {partyInfo.isEdit ? (
                                                            <div>
                                                                <div>
                                                                    {errValidation && (
                                                                        <div className='text-danger mb-4 ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                                                                            {errValidation}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Form.Group>
                                                                    <Form.Label className='mb-0'>Date:</Form.Label>
                                                                    <Form.Control
                                                                        type='date'
                                                                        value={partyValue.partyDate}
                                                                        onChange={event => handleChange('partyDate', event.target.value)}
                                                                    />
                                                                    <Form.Label className='mt-1 mb-0'>From:</Form.Label>
                                                                    <Form.Select
                                                                        type='time'
                                                                        value={partyValue.partyTimeFrom}
                                                                        onChange={(event) => handleChange('partyTimeFrom', event.target.value)}
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
                                                                        value={partyValue.partyTimeTo}
                                                                        onChange={(event) => handleChange('partyTimeTo', event.target.value)}
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
                                                                <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyValue.partyPlace}
                                                                    onChange={event => handleChange('partyPlace', event.target.value)} />
                                                                <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace2}
                                                                    onChange={event => handleChange('partyPlace2', event.target.value)} />
                                                                <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace3}
                                                                    onChange={event => handleChange('partyPlace3', event.target.value)} />
            {/*         
                                                                <label className='me-3 mt-1' htmlFor='partyContact1'>Contact1: </label>
                                                                <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyValue.partyContact1}
                                                                    onChange={event => handleChange('partyContact1', event.target.value)} />

                                                                <label className='me-3 mt-1' htmlFor='partyContact2'>Contact2: </label>
                                                                <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyValue.partyContact2}
                                                                    onChange={event => handleChange('partyContact2', event.target.value)} /> */}

                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div>Date:</div>
                                                                <div className='fs-5 d-flex justify-content-center'> {partyInfo.partyDate2}</div>
                                                                <div className='fs-6 d-flex justify-content-center'>{partyInfo.partyTimeFrom || <>&nbsp;</>} ~ {partyInfo.partyTimeTo}</div>
                                                                <div className='mt-1'>Location:</div>
                                                                    <div className='d-flex flex-column justify-content-center ms-3 mt-2'>
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
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='row g-0'>
                            <div className='col-md-3'>
                                <div>
                                    {/* selected party card */}
                                    <div className='card mt-4 m-3'>
                                        <div className='card-header p-3'>
                                        <div className='d-flex justify-content-center align-items-end'>
                                                <div className='fs-3 me-4'>{partyValue.childName}</div>
                                                <div className='fs-5'>{partyValue.childYears} years old</div>
                                            </div>
                                        </div>
                                        <div className='card-body p-4'>
                                            {/* Edit party */}
                                            {partyValue.isEdit ? (
                                                <div>
                                                    <div>
                                                        {errValidation && (
                                                            <div className='text-danger mb-4 ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                                                                {errValidation}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Form.Group>
                                                        <Form.Label className='mb-0'>Date:</Form.Label>
                                                        <Form.Control
                                                            type='date'
                                                            value={partyValue.partyDate}
                                                            onChange={event => handleChange('partyDate', event.target.value)}
                                                        />
                                                        <Form.Label className='mt-1 mb-0'>From:</Form.Label>
                                                        <Form.Select
                                                            type='time'
                                                            value={partyValue.partyTimeFrom}
                                                            onChange={(event) => handleChange('partyTimeFrom', event.target.value)}
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
                                                            value={partyValue.partyTimeTo}
                                                            onChange={(event) => handleChange('partyTimeTo', event.target.value)}
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
                                                    <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyValue.partyPlace}
                                                        onChange={event => handleChange('partyPlace', event.target.value)} />
                                                    <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace2}
                                                        onChange={event => handleChange('partyPlace2', event.target.value)} />
                                                    <input id='partyPlace' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace3}
                                                        onChange={event => handleChange('partyPlace3', event.target.value)} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div>Date:</div>
                                                    <div className='fs-5 d-flex justify-content-center'> {partyValue.partyDate2}</div>
                                                    <div className='fs-6 d-flex justify-content-center'>{partyValue.partyTimeFrom || <>&nbsp;</>} ~ {partyValue.partyTimeTo}</div>
                                                    <div className='mt-1'>Location:</div>
                                                        <div className='d-flex flex-column justify-content-center ms-3 mt-2'>
                                                            <div>
                                                                {partyValue.partyPlace || <>&nbsp;</>}
                                                            </div>
                                                            <div>
                                                                {partyValue.partyPlace2 || <>&nbsp;</>}
                                                            </div>
                                                            <div>
                                                                {partyValue.partyPlace3 || <>&nbsp;</>}
                                                            </div>
                                                        </div>

                                                </div>
                                            )}
                                        </div>

                                        {/* Edit Delete */}
                                        <div className='d-flex justify-content-end mb-3 me-2'>
                                            {partyValue.isEdit && (
                                                <span onClick={() => {handleCancel(partyValue.idParty)}} className='text-danger me-3'  style={{ cursor: 'pointer' }}>
                                                    Cancel
                                                </span>
                                            )}
                                            {new Date(partyValue.partyDate) > new Date() && (
                                                <span className='text-primary me-3' style={{ cursor: 'pointer' }} 
                                                    onClick={ (event) => {
                                                        partyValue.isEdit ? handleUpdate(event, partyValue.idParty) : handleEdit(event,partyValue.idParty);}}>
                                                    {partyValue.isEdit ? 'Update' : 'Edit'}
                                                </span>
                                            )}
                                            <span onClick={(event) => handleDelete(event, partyValue.idParty)} className='text-danger me-3' style={{ cursor: 'pointer' }} >
                                                Delete
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='col-md-5'>
                                <div>
                                    <Todo partyId={selectedParty} />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div>
                                    <Shopping partyId={selectedParty} />
                                </div>
                            </div>
                        </div>
                        <div className='row g-0'>
                            <div className='col-md-4'>
                                <div>
                                    <Invitation partyId={selectedParty} />
                                </div>
                            </div>
                            <div className='col-md-8'>
                                <div>
                                    <Guest partyId={selectedParty} childId={selectedChildId}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
  )
}

export default Party
