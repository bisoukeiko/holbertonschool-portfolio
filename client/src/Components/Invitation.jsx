import React from 'react'
import { useNavigate } from 'react-router-dom';


function Invitation({ partyId }) {

    const navigate = useNavigate();

    const handleCreateCard = () => {
        navigate('/createcard', { state: { partyId } });
      };


  return (

        <div className='d-flex flex-column w-100 justify-content-center mt-3'>
        <div className='card w-100 m-3'>
            <div className='card-header'>
                    <h4 className='p-1'>Invitation</h4>
                </div>
                <div className='card-body'>
                <button type='button' class='btn btn-outline-primary' onClick={handleCreateCard}>
                    Create Invitation Card
                </button>
                </div>
            </div>
        </div>


  )
}

export default Invitation
