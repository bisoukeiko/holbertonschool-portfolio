import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


function Rsvp() {
    const { partyId } = useParams();
    const navigate = useNavigate();

    const [errValidation, setErrValidation] = useState([]);

    const [guestList, setGuestList] = useState([]);
    const [partyInfo, setPartyInfo] = useState({});

    const [guestValue, setGuestValue] = useState({
        idGuest: '',
        guestName: '',
        guestRelation: '',
        guestAllergy: '',
        otherInfo: '',
        parentPhone: '',
        parentEmail: '',
        fgAttend: ''
    });

    useEffect(() => {
      if (partyId) {
          axios.get(`http://localhost:5000/guest/select`, {params: { partyId: partyId }})
              .then(res => {
                  // console.log(res.data);
                  setGuestList(res.data);
              })
              .catch(err => console.log(err));

          axios.get(`http://localhost:5000/party/select`, {params: { partyId: partyId }})
          .then(res => {
              // console.log('party: ', res.data[0]);
              setPartyInfo(res.data[0]);
          })
          .catch(err => console.log(err));
       }
    }, [partyId]);


    const getOrdinalSuffix = (num) => {
      if (num === 1) return 'st';
      if (num === 2) return 'nd';
      if (num === 3) return 'rd';
      return 'th';
    };


    const handleChange = (guestId, field, value) => {
      setGuestValue({ ...guestValue, [field]: value});
    };


    const handleSend = (event) => {
      event.preventDefault();
      setErrValidation([])

      const updatedValues = { ...guestValue };

      // console.log('updatedValues', updatedValues);
      axios.put(`http://localhost:5000/guest/updateRsvp/${updatedValues.idGuest}`, {...updatedValues, 'partyId': partyId})
      .then(res => {
          alert("Your response registered successfully!");
          setErrValidation([])
          navigate('/');
      })
      .catch((err) => {
          if (err.response && err.response.data.errors) {
            setErrValidation(err.response.data.errors.join('\n'));
          } else {
            console.error('Error updating guest:', err);
          }
      });
    }

  return (
    <div className='bg-info-subtle'>
        <div className='container py-4'>
        <div className='d-flex flex-column justify-content-center align-items-center'>

          <h2 className='text-center mt-5 mb-5'>🎂 RSVP for the Borthday Party🎈</h2>
          <div className='text-center mb-5'>
              Please let us know if your child can make it to the birthday party!
          </div>


              <div className='card shadow-lg w-75 p-4 mb-5'>
                <h3 className='text-center mb-3'>
                  {partyInfo.childName}'s {partyInfo.childYears}{getOrdinalSuffix(partyInfo.childYears)} Birthday Party 🎉
                </h3>

                <div className='d-flex flex-column align-items-center gap-3'>
                  <div className='d-flex flex-wrap justify-content-center gap-5'>
                    <div className='text-center'>
                      <h5 className='text-primary'>📅 Date</h5>
                      <p>{partyInfo.partyDate}</p>
                    </div>
                    <div className='text-center'>
                      <h5 className='text-primary'>⏰ Time</h5>
                      <p>{partyInfo.partyTimeFrom} - {partyInfo.partyTimeTo}</p>
                    </div>
                    <div className='text-center'>
                      <h5 className='text-primary'>📍 Location</h5>
                      <p>{partyInfo.partyPlace}</p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <h5 className='text-primary'>📞 Contact</h5>
                    <p>{partyInfo.partyContact1} {partyInfo.partyContact2 && `/ ${partyInfo.partyContact2}`}</p>
                  </div>
                </div>
              </div>

              <div className='card shadow-l w-75 p-5 mb-5'>

                <div className='d-flex flex-column justify-content-center align-items-center p-4'>
                    {/* dropdown child name */}
                    <Dropdown>
                        <Dropdown.Toggle variant='light' id='dropdown-basic'className='fs-6 mb-4 border' style={{ width: '200px' }}>
                        {guestValue.guestName && guestValue.guestRelation 
                              ? `${guestValue.guestName} (${guestValue.guestRelation})` 
                              : 'Select guest name'}
                        </Dropdown.Toggle>
              
                        <Dropdown.Menu  style={{ width: '200px' }}>
                            {guestList.map((guest) => (
                                <Dropdown.Item 
                                    key={guest.idguest} 
                                    onClick={() => setGuestValue(guest)}>
                                    {`${guest.guestName} (${guest.guestRelation || ''})`}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className=' mt-4 mb-2'>
                        Can he/she come?
                    </div>

                    <div className='d-flex mb-5'>
                        <div className='form-check me-4'>
                          <input
                            className='form-check-input'
                            type='radio'
                            name={`fgAttend_${guestValue.idGuest}`}
                            id='fgAttend1'
                            checked={guestValue.fgAttend === '1'}
                            onChange={() => handleChange(guestValue.idGuest, 'fgAttend', '1')}
                          />
                          <label className='form-check-label' htmlFor='fgAttend1'>
                            Yes
                          </label>
                        </div>

                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='radio'
                            name={`fgAttend_${guestValue.idGuest}`}
                            id='fgAttend2'
                            checked={guestValue.fgAttend === '2'}
                            onChange={() => handleChange(guestValue.idGuest, 'fgAttend', '2')}
                          />
                          <label className='form-check-label' htmlFor='fgAttend2'>
                            No
                          </label>
                        </div>
                    </div>  

                    <div className='' style={{ width: '40%' }}>

                        <label htmlFor='guestAllergy' className='ms-2'>Allergy</label>
                        <input id='guestAllergy' type='text' placeholder='ex: gulten' className='form-control mb-5' value={guestValue.guestAllergy}
                            onChange={event => handleChange(guestValue.idGuest, 'guestAllergy', event.target.value)}
                        />

                        <label htmlFor='parentPhone' className='ms-2'>Parents phone number *</label>
                        <input id='parentPhone' type='text' placeholder='' className='form-control mb-5' value={guestValue.parentPhone}
                            onChange={event => handleChange(guestValue.idGuest, 'parentPhone', event.target.value)}
                        />

                        <label htmlFor='parentEmail' className='ms-2'>Parents E-mail</label>
                        <input id='parentEmail' type='text' placeholder='' className='form-control mb-5' value={guestValue.parentEmail}
                            onChange={event => handleChange(guestValue.idGuest, 'parentEmail', event.target.value)}
                        />

                        <label htmlFor='otherInfo' className='ms-2'>Other Information</label>
                        <textarea id='otherInfo' type='text' placeholder='' className='form-control mb-5' value={guestValue.otherInfo}
                            onChange={event => handleChange(guestValue.idGuest, 'otherInfo', event.target.value)}>
                        </textarea>

                    </div>

                    {/* error message */}
                    <div>
                        {errValidation && (
                            <div className='text-danger mb-4' style={{ whiteSpace: 'pre-wrap' }}>
                                {errValidation}
                            </div>
                        )}
                    </div>

                    <button class='btn btn-primary' type='submit' onClick={handleSend}>
                        Send
                    </button>

                </div>
              </div>
        </div>
      </div>
  </div>

  )
}

export default Rsvp
