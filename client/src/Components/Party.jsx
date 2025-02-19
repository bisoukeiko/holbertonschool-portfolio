import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {Dropdown, Form } from 'react-bootstrap';
import Todo from './Todo';


function Party() {
    const { userId } = useUser();

    const location = useLocation();
    const childList = location.state?.childList || [];
    const partyData = location.state?.partyData || {};

    const [selectedChildName, setSelectedChildName] = useState(''); // dropdown child name
    const [selectedChildId, setSelectedChildId] = useState(''); // dropdown child id
    const [selectedYear, setSelectedYear] = useState('');// dropdown year
    const [selectedParty, setSelectedParty] = useState('');// dropdown year choise -> party id set
    const [yearList, setYearList] = useState([]); 
    const [partyList, setPartyList] = useState([]);
    const [noPartiesMsg, setNoPartiesMsg] = useState(''); 

    const [partyValue, setPartyValue] = useState({
        idParty: '',
        idChild: '',
        partyDate: '',
        partyTimeFrom: '',
        partyTimeTo: '',
        partyPlace: '',
        partyContact1: '',
        partyContact2: '',
        childName: '',
        userPhone: ''
    });

    const [isAdd, setIsAdd] = useState(false);



    useEffect(() => {
        if (selectedParty) {
            setSelectedParty(selectedParty);
        } else {
            if (!selectedChildName) {
                setSelectedParty(partyData.idParty);
                setSelectedChildName(partyData.childName);
                setSelectedChildId(partyData.idChild);
                setSelectedYear(partyData.childYears);
                const selectedChildData = childList.find(child => child.id_child === partyData.idChild);
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

    const handleCancel = () => {
        setPartyValue({
            idParty: '',
            idChild: '',
            partyDate: '',
            partyTimeFrom: '',
            partyTimeTo: '',
            partyPlace: '',
            partyContact1: '',
            partyContact2: '',
            childName: '',
            userPhone: ''
            });

        setIsAdd(false);
        setSelectedYear('');
    }

    const handleAdd = (event) => {
        event.preventDefault();

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
                    partyContact1: '',
                    partyContact2: '',
                    childName: '',
                    userPhone: ''
                    });

                setIsAdd(false);
                // setSelectedParty('');
                // setSelectedYear('');
            })
            .catch(err => console.log(err));

    }

    const handleUpdate = (event, partyId) => {
        event.preventDefault();

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
                partyContact1: '',
                partyContact2: '',
                childName: '',
                userPhone: ''
            });
        })
        .catch(err => console.log(err));
  };


    const handleDelete = (event, partyId) => {
        event.preventDefault();

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
            <div className='col-md-4'>
                {/* Add button */}
                <div className=''>
                        {isAdd ? (
                            <button onClick={handleCancel} className='btn btn-outline-danger btn-sm text ms-4 p-2'
                                    style={{ width: '150px' }}>
                                Cancel addition
                            </button>
                        ) : (
                            <button onClick={() => setIsAdd(true)} className='btn btn-light btn-sm fs-5 text ms-4 p-3'
                                    style={{ width: '200px' }}>
                                + Add a new party
                            </button>
                        )}
                </div>
            </div>
            <div className='col-md-6'>
                <div className='d-flex'>
                    <Dropdown className='me-4'>
                        <Dropdown.Toggle variant='light' id='dropdown-basic' style={{ width: '200px' }}>
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
                        <Dropdown.Toggle variant='light' id='dropdown-basic' style={{ width: '200px' }}>
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
            <div className='container mt-4'> 
                <div className='row justify-content-center'>
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}

                        <div className='d-flex min-vh-100 flex-column mt-1'>
                            <div  className='w-100 bg-white rounded p-3 '>
                                {/* new party form */}
                                {isAdd ? (
                                    <div className='card mb-2'>
                                        <div className='card-header p-3'>
                                            <div className='d-flex flex-column'>

                                                {/* dropdown child name */}
                                                <Dropdown className='me-4 d-flex justify-content-center'>
                                                    <Dropdown.Toggle variant='light' id='dropdown-basic'className='fs-5' style={{ width: '200px' }}>
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
                                                        onChange={event => handleChange(selectedParty, 'partyDate', event.target.value)}
                                                    />
                                                    <Form.Label className='mt-2'>From:</Form.Label>
                                                    <Form.Select
                                                        type='time'
                                                        value={partyValue.partyTimeFrom}
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
                                                        value={partyValue.partyTimeTo}
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

                                                
                                                <label  className='mt-2' htmlFor='partyPlace'>Place: </label>
                                                <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyValue.partyPlace}
                                                    onChange={event => handleChange(selectedParty, 'partyPlace', event.target.value)} />

                                                <label  className='mt-2' htmlFor='partyContact1'>Contact1: </label>
                                                <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyValue.partyContact1}
                                                    onChange={event => handleChange(selectedParty, 'partyContact1', event.target.value)} />

                                                <label  className='mt-2' htmlFor='partyContact2'>Contact2: </label>
                                                <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyValue.partyContact2}
                                                    onChange={event => handleChange(selectedParty, 'partyContact2', event.target.value)} />
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                <button onClick={ handleAdd } className='btn btn-outline-secondary btn-sm mt-3'>
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Party Cards */}
                                        {partyList
                                            ?.filter((partyInfo) => !selectedYear || partyInfo.idParty === selectedParty)
                                            .map((partyInfo) => (
                                                <div className='card mb-2'>
                                                    <div className='card-header p-3'>
                                                        <div className='d-flex flex-column'>
                                                            <div className='fs-5'>{partyInfo.childName}</div>
                                                            <div className='fs-5 d-flex justify-content-center'>{partyInfo.childYears} years old</div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body flex-grow-1'>
                                                        
                                                        {/* Edit party */}
                                                        {partyInfo.isEdit ? (
                                                            <div>
                                                                <Form.Group>
                                                                    <Form.Label>Date:</Form.Label>
                                                                    <Form.Control
                                                                        type='date'
                                                                        value={partyInfo.partyDate}
                                                                        onChange={event => handleChange(partyInfo.idParty, 'partyDate', event.target.value)}
                                                                    />
                                                                    <Form.Label>From:</Form.Label>
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

                                                                    <Form.Label>To:</Form.Label>
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

                                                                
                                                                <label className='me-3' htmlFor='partyPlace'>Place: </label>
                                                                <input id='partyPlace' type='text' placeholder=''className='form-control' value={partyInfo.partyPlace}
                                                                    onChange={event => handleChange(partyInfo.idParty, 'partyPlace', event.target.value)} />

                                                                <label className='me-3' htmlFor='partyContact1'>Contact1: </label>
                                                                <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyInfo.partyContact1}
                                                                    onChange={event => handleChange(partyInfo.idParty, 'partyContact1', event.target.value)} />

                                                                <label className='me-3' htmlFor='partyContact2'>Contact2: </label>
                                                                <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyInfo.partyContact2}
                                                                    onChange={event => handleChange(partyInfo.idParty, 'partyContact2', event.target.value)} />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p>Date: {partyInfo.partyDate}</p>
                                                                <p>From {partyInfo.partyTimeFrom} To {partyInfo.partyTimeTo}</p>
                                                                <p>Place: {partyInfo.partyPlace}</p>
                                                                <p>contact1: {partyInfo.partyContact1}</p>
                                                                <p>contact2: {partyInfo.partyContact2}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Edit Delete */}
                                                    <div className='d-flex justify-content-end mb-2'>
                                                        <span className='text-primary me-2' style={{ cursor: 'pointer' }} 
                                                            onClick={ (event) => {
                                                                partyInfo.isEdit ? handleUpdate(event, partyInfo.idParty) : handleEdit(event,partyInfo.idParty);}}>
                                                            {partyInfo.isEdit ? 'Update' : 'Edit'}
                                                        </span>
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
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}
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
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}
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
                </div>
            </div>
        )}
    </div>
  )
}

export default Party
