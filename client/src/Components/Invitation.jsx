import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';


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
    

    const handlePrint = () => {
        if (!imageUrl) {
            return;
        }
    
        const pdf = new jsPDF('l', 'mm', 'a4'); 
    
        // 画像の幅と高さを指定
        const imageWidth = 130; // 画像の幅
        const imageHeight = 180; // 画像の高さ（縦長の画像を収める）
    
        const padding = 10; // 画像と画像の間の余白
    
        pdf.addImage(imageUrl, 'PNG', 10, 10, imageWidth, imageHeight);
    
        pdf.addImage(imageUrl, 'PNG', 10 + imageWidth + padding, 10, imageWidth, imageHeight);
    
        pdf.save('invitation.pdf');
    };


    const handleDownload = () => {
        try {
            if (!imageUrl) {
                alert('Image is not loaded yet.');
                return;
            }
    
            // a タグを作成
            const a = document.createElement('a');
            a.href = imageUrl;  // 画像のURLをリンクとして設定
            a.download = 'invitation.png';  // ダウンロードするファイル名を設定
    
            // a タグをクリックしてダウンロードを開始
            a.click();
        } catch (e) {
            console.error(e);
            alert(`Error: ${e}`);
        }
    };


  return (

        <div className='d-flex flex-column justify-content-center mt-2'>
        <div className='card  m-3'>
            <div className='card-header'>
                    <div className='d-flex justify-content-between m-2'>
                        <h4 className=''>Invitations</h4>
                    </div>

                </div>
                <div className='card-body'>
                    <div className="text-center">
                        {partyIdInvitation ? (
                            <div>
                                {imageUrl ? (
                                    <div>
                                        <div className='d-flex justify-content-around mb-2'>
                                            <button className='btn btn-outline-secondary' onClick={handlePrint}>
                                                Print
                                            </button>
                                            <button className='btn btn-outline-secondary' onClick={handleDownload}>
                                                Download
                                            </button>
                                            <button type='button' class='btn btn-outline-primary' onClick={handleCreateCard}>
                                                Modify Invitation Card
                                            </button>
                                        </div>
                                        <img src={imageUrl} alt="Invitation" className="img-fluid rounded" />
                                    </div>
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
