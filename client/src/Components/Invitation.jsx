import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';


function Invitation({ partyId }) {
    const { token } = useUser();
    const navigate = useNavigate();

    const [partyIdInvitation, setPartyIdInvitation] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);


    useEffect(() => {
        setPartyIdInvitation(null);
        setImageUrl(null);

        if (partyId) {
            axios.get(`http://localhost:5000/party/select`, {params: { partyId: partyId }})
            .then(res => {
                if(res.data[0].partyIdInvitation) {
                    setPartyIdInvitation(res.data[0].partyIdInvitation);
                }
            })
            .catch(err => console.log(err));
        }
    }, [partyId]);


    useEffect(() => {
        if (partyIdInvitation) {
            const fetchImage = async () => {
                const url = await getImageFromDrive(partyIdInvitation);
                if (url) setImageUrl(url);
            };
            fetchImage();
        }
    }, [partyIdInvitation]);

    const handleCreateCard = () => {
        navigate('/createcard', { state: { partyId } });
      };


    const getImageFromDrive = async (fileId) => {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,  // ログインユーザーのトークンを使用
            },
        });
    
        if (!response.ok) {
            console.error("画像の取得に失敗しました");
            return null;
        }
    
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };
    



  return (

        <div className='d-flex flex-column justify-content-center mt-3'>
        <div className='card  m-3'>
            <div className='card-header'>
                    <div className='d-flex justify-content-between m-2'>
                        <h4 className='p-1'>Invitation</h4>
                        <div className=' d-flex justify-content-end'>
                            {partyIdInvitation && (
                                <button type='button' class='btn btn-outline-primary' onClick={handleCreateCard}>
                                    Modify Invitation Card
                                </button>
                            )}
                        </div>
                    </div>

                </div>
                <div className='card-body'>
                    <div className="text-center">
                        {partyIdInvitation ? (
                            <div>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Invitation" className="img-fluid rounded" />
                                ) : (
                                    <p>Loading Images...</p>
                                )}
                            </div>
                        ) : (
                            <button type='button' class='btn btn-outline-success m-4' onClick={handleCreateCard}>
                                Create Invitation Card
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>


  )
}

export default Invitation
