import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {Dropdown} from 'react-bootstrap';
import Todo from './Todo';


function Party() {
    // const { userId } = useUser();

    const location = useLocation();
    const childList = location.state?.childList || [];
    const partyData = location.state?.partyData || {};

    console.log(childList);

    const [selectedChild, setSelectedChild] = useState(''); // dropdown child name
    const [selectedYear, setSelectedYear] = useState('');// dropdown year
    const [selectedParty, setSelectedParty] = useState('');// dropdown year choise -> party id set
    const [yearList, setYearList] = useState([]); 
    const [partyList, setPartyList] = useState([]);
    const [noPartiesMsg, setNoPartiesMsg] = useState(''); 

    // const [partyValue, setPartyValue] = useState({
    //     partyId: '',
    //     date: '',
    //     time_from: '',
    //     time_to: '',
    //     place: '',
    //     contact1: '',
    //     contact2: '',
    //     child_name: '',
    //     user_phone: ''
    // });


    // const [isAdd, setIsAdd] = useState(false);


    useEffect(() => {
        if (selectedParty) {
            setSelectedParty(selectedParty);
        } else {
            if (!selectedChild) {
                setSelectedParty(partyData.id_party);
                setSelectedChild(partyData.child_name);
                setSelectedYear(partyData.child_years);
                const selectedChildData = childList.find(child => child.id_child === partyData.id_child);
                setPartyList(selectedChildData.child_parties);
            }
        }
    }, [selectedParty, partyData, childList]);


    const handleSelect = (childData) => {
        setSelectedChild(childData.child_name);

        if (childData.child_parties && childData.child_parties.length > 0) {
            setYearList(childData.child_parties);
            setPartyList(childData.child_parties);
            setNoPartiesMsg('');
        } else {
            setYearList([]);
            setPartyList([]);
            setNoPartiesMsg('No parties found for this child.');
        }

        setSelectedYear('');
        setSelectedParty('');
    };

    const handleSelectYear = (party) => {
        setSelectedYear(party.child_years);
        setSelectedParty(party.id_party);
    }

  //   useEffect(() => {
  //     if (userId) {
  //       axios.get(`http://localhost:5000/party/selectByIdUser/`, {params: { userId: userId }})
  //         .then(res => {
  //           if (res.data.length !== 0) {
  //             console.log(res.data[0]);
  //             const partyData = res.data.map(party => ({
  //               ...party, isEdit: false
  //             }));
  //             setPartyList(partyData);
  //           } else {
  //             setPartyList([]);  
  //           }
  //         })
  //         .catch(err => console.log(err))
  //       } else {
  //         setPartyList([]);
  //       }
  // }, [selectedParty]);


  // const handleEdit = (event, partyId) => {
  //   event.preventDefault();
  //   // 現在のpartyListから対象のpartyデータを取得
  //   const targetParty = partyList.find(party => party.id_party === partyId);

  //   if (!targetParty) return;

  //   // 既存の値を保持しながら、変更された値だけを更新
  //   setValues({ ...targetParty, id_parent: userId });
  //   setPartyList(partyList.map(party =>
  //     party.id_party === partyId ? {...party, isEdit: true} : party
  //     ));
  // };

  // const handleChange = (partyId, field, value) => {
  //   setValues({ ...values, [field]: value});
  //   setPartyList(partyList.map(party =>
  //     party.id_party === partyId ? {...party, [field]: value} : party
  //   ));  
  // };

  // const handleUpdate = (event, partyId) => {
  //   event.preventDefault();

  //   const updatedValues = { ...values, partyId: partyId };
  //   // console.log(updatedValues);

  //   axios.put(`http://localhost:5000/party/update/${partyId}`, updatedValues)
  //   .then(res => {
  //       // console.log(res);
  //       const partyData = res.data.map(party => ({...party, isEdit: false}));
  //       setPartyList(partyData);
  //       setValues({
  //         partyId: '',
  //         date: '',
  //         time_from: '',
  //         time_to: '',
  //         place: '',
  //         contact1: '',
  //         contact2: '',
  //         child_name: '',
  //         user_phone: ''
  //       });
  //   })
  //   .catch(err => console.log(err));
  // };


  // const handleDelete = (partyId) => {
  //   axios.delete(`http://localhost:5000/party/delete/${partyId}`, {params: { userId: userId }})
  //     .then(res => {
  //       if (res.data.length !== 0) {
  //         console.log(res.data[0]);
  //         const partyData = res.data.map(party => ({
  //           ...party, isEdit: false
  //         }));
  //         setPartyList(partyData);
  //       } else {
  //         setPartyList([]);  
  //       }
  //     })
  //     .catch(err => console.log(err));
  // }




  return (

    <div>
      
      <div className='d-flex justify-content-center m-5'>
            <Dropdown className='me-4'>
                <Dropdown.Toggle variant='light' id='dropdown-basic' style={{ width: '200px' }}>
                    {selectedChild || 'Select Child'}
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
                            key={party.id_party} 
                            onClick={() => handleSelectYear(party)}>
                            {party.child_years} years old
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
      </div>

      {noPartiesMsg ? (
            <div className="alert alert-warning" role="alert">
                <div className='d-flex justify-content-center'>
                    {noPartiesMsg}
                </div>
            </div>
        ) : (
            <div className='container mt-4'> 
                <div className='row justify-content-center'>
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}

                        <div className='d-flex min-vh-100 flex-column mt-1'>
                            <div  className='w-100 bg-white rounded p-3 '>
                                {partyList
                                    ?.filter((partyInfo) => !selectedYear || partyInfo.id_party === selectedParty)
                                    .map((partyInfo) => (
                                        <div className='card mb-2'>
                                            <div className='card-header p-3'>
                                                <div className='d-flex flex-column'>
                                                    <div className='fs-5'>{partyInfo.child_name}</div>
                                                    <div className='fs-5 d-flex justify-content-center'>{partyInfo.child_years} years old</div>
                                                </div>
                                            </div>
                                            <div className='card-body flex-grow-1'>
                                                <p>Date: {partyInfo.party_date}</p>
                                                <p>Time: {partyInfo.party_time_from} - {partyInfo.party_time_to}</p>
                                                <p>Place: {partyInfo.place}</p>
                                            </div>
                                        </div>
                                ))}
                            </div>
                        </div>
            
                    </div>
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}
                        {selectedYear && (
                            <div>
                                <Todo partyId={selectedParty} />
                            </div>
                        )}
                    </div>
                    <div className='col-md-4'> {/* 画面幅の半分を使用 */}
                        {selectedYear && (
                            <div>
                                <Todo partyId={selectedParty} />
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
