import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Qrcode from './Qrcode';
import {Dropdown, Form } from 'react-bootstrap';

import { useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

import card_1 from '../assets/template/card_1.png';
import card_2 from '../assets/template/card_2.png';
import card_3 from '../assets/template/card_3.jpeg';
import card_4 from '../assets/template/card_4.jpeg';
import card_5 from '../assets/template/card_5.jpeg';
import card_9 from '../assets/template/card_9.png';
import card_10 from '../assets/template/card_10.png';
import card_11 from '../assets/template/card_11.png';
import card_12 from '../assets/template/card_12.png';
import card_13 from '../assets/template/card_13.png';
import card_14 from '../assets/template/card_14.png';
import card_15 from '../assets/template/card_15.png';
import card_16 from '../assets/template/card_16.png';
import card_17 from '../assets/template/card_17.png';
import card_18 from '../assets/template/card_18.png';
import card_19 from '../assets/template/card_19.png';
import card_20 from '../assets/template/card_20.png';


function CreateCard() {
    const { userId } = useUser();

    const location = useLocation();
    const { partyId } = location.state || {};

    const [isEdit, setIsEdit] = useState(false);
    const [errValidation, setErrValidation] = useState([]);

    const [childList, setChildList] = useState([]);
    const [yearList, setYearList] = useState([]); 
    const [selectedChildName, setSelectedChildName] = useState(''); // dropdown child name
    const [selectedYear, setSelectedYear] = useState('');// dropdown year
    const [selectedParty, setSelectedParty] = useState(partyId);// dropdown year choise -> party id set
    const [noPartiesMsg, setNoPartiesMsg] = useState(''); 

    const [partyValue, setPartyValue] = useState({
        partyDate: '',
        partyDate2: '',
        partyTimeFrom: '',
        partyTimeTo: '',
        partyPlace: '',
        partyPlace2: '',
        partyPlace3: '',
        partyContact1: '',
        partyContact2: '',
        childName: '',
        childYears: '',
        partyDelete: ''
    });

    // canvas, QRcode
    const canvasRef = useRef(null);
    const [qrCodeImg, setQrCodeImg] = useState(null);


    useEffect(() => {
        if (userId) {
            console.log('userId: ', userId);
            axios.get(`http://localhost:5000/child/selectByIdUser`, {params: { userId: userId }})
            .then(res => {
                console.log('childList: ', res.data);
                setChildList(res.data);
            })
            .catch(err => console.log(err));



            if (selectedParty) {
                axios.get(`http://localhost:5000/party/select`, {params: { partyId: selectedParty }})
                .then(res => {
                    console.log('partyselect1: ', res.data[0]);
                    setPartyValue(res.data[0]);
                    setIsEdit(false);
                })
                .catch(err => console.log(err));
            }
        }
      }, [selectedParty, userId]);


    const handleSelect = (childData) => {
        setSelectedChildName(childData.childName);

        axios.get(`http://localhost:5000/party/selectByIdChild`, {params: { childId: childData.idChild }})
        .then(res => {
            if (res.data && res.data.length > 0) {
                setYearList(res.data);
                setNoPartiesMsg('');
            } else {
                setYearList([]);
                setNoPartiesMsg('No parties found for this child.');
            }
        })
        .catch(err => console.log(err));

        setSelectedYear('');
        // setSelectedParty('');
    }

    const handleSelectYear = (party) => {
        setSelectedYear(party.childYears);
        setSelectedParty(party.idParty);
        console.log('idParty: ',party.idParty);
    }

    const handleEdit = () => {
        // if (!partyValue.partyContact1) {
        //     setPartyValue({ ...partyValue, partyContact1: partyValue.userPhone});
        // }
        setIsEdit(true);
    }

    
    const handleChange = (field, value) => {
        setPartyValue({ ...partyValue, [field]: value});
      };


    const handleUpdate = (event) => {
        event.preventDefault();
        setErrValidation([]);
        console.log('partyValue update: ', partyValue);

        const updatedValues = { ...partyValue };
        const partyId = selectedParty;

        axios.put(`http://localhost:5000/party/update/${partyId}`, updatedValues)
        .then(res => {
            setPartyValue(res.data[0]);
            console.log('partyup: ', res.data[0]);
            setErrValidation([]);
            setIsEdit(false);
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


    const handleQrCodeGenerated = (qrImg) => {
        setQrCodeImg(qrImg);
    }

    const selectTemplate = (imgSrc, qrCodeImg, police, color, yStart) => {
    
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
    
        const dpr = window.devicePixelRatio || 1;
    
        // Canvas の解像度を高く設定
        // Set the canvas resolution to a higher value
        canvas.width = 350 * dpr;
        canvas.height = 500 * dpr;
        canvas.style.width = "350px";
        canvas.style.height = "500px";
        
        // 高解像度スケールを適用
        ctx.scale(dpr, dpr);
    
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 一度クリアにする。
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
    
            // パーティー情報を描画
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
    
            const centerX = canvas.width / (2 * dpr); // ★キャンバスの中央を計算
            let yOffset = yStart; // テキストの開始位置
            const lineHeight = 20; // 行の間隔
    
            // テキストを折り返して描画する関数
            const drawTextWithWrap = (text, y, fontSize) => {
                ctx.font = `${fontSize}px ${police}`; // フォントサイズを指定
                const textWidth = ctx.measureText(text).width;
                
                // もしテキストが幅を超えるなら2行に分ける（簡易版）
                if (textWidth > 300) {
                    const words = text.split(" ");
                    let line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
                    let line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
                    ctx.fillText(line1, centerX, y);
                    ctx.fillText(line2, centerX, y + lineHeight);
                    return y + lineHeight * 2;
                } else {
                    ctx.fillText(text, centerX, y);
                    return y + lineHeight;
                }
            };
    
            // 名前の表示
            if (partyValue.childName) {
                yOffset = drawTextWithWrap(`${partyValue.childName}'s`, yOffset, 50);
                yOffset += 30; // ★ 名前と年齢の間にスペースを作る
            }

            // 年齢の表示
            if (partyValue.childYears) {
                yOffset = drawTextWithWrap(`${partyValue.childYears}th Birthday Party`, yOffset, 35);
                yOffset += 30; // ★ 年齢と日付の間にもスペースを作る
            }

            // 日付の表示
            if (partyValue.partyDate2 || partyValue.partyDate) {
                yOffset = drawTextWithWrap(`${partyValue.partyDate2 || partyValue.partyDate}`, yOffset, 24);
                yOffset += 10;
            }

            // 時間の表示
            if (partyValue.partyTimeFrom && partyValue.partyTimeTo) {
                yOffset = drawTextWithWrap(`${partyValue.partyTimeFrom} - ${partyValue.partyTimeTo}`, yOffset, 18);
                yOffset += 10;
            }

            // 場所の表示
            if (partyValue.partyPlace) {
                yOffset = drawTextWithWrap(`${partyValue.partyPlace}`, yOffset, 14);
                yOffset += 5;
            }
            if (partyValue.partyPlace2) {
                yOffset = drawTextWithWrap(`${partyValue.partyPlace2}`, yOffset, 14);
                yOffset += 5;
            }
            if (partyValue.partyPlace3) {
                yOffset = drawTextWithWrap(`${partyValue.partyPlace3}`, yOffset, 14);
                yOffset += 5;
            }

            // 連絡先の表示
            if (partyValue.partyContact1) {
                let contactText = partyValue.partyContact1;
                if (partyValue.partyContact2) {
                    contactText += ` / ${partyValue.partyContact2}`;
                }
                yOffset = drawTextWithWrap(contactText, yOffset, 12);
            }
    
            // QRコードの描画位置
            const qrSize = 60;
            const qrX = canvas.width / dpr - qrSize - 20;
            const qrY = canvas.height / dpr - qrSize - 20;

            // QRコードの描画
            if (qrCodeImg) {
                const qrImg = new Image();
                qrImg.src = qrCodeImg;
                qrImg.onload = () => {
                    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        
                    // RSVP の描画（QRコードの上）
                    ctx.font = `10px ${police}`; 
                    ctx.textAlign = "center"; // 中央揃え
                    ctx.fillText("RSVP", qrX + qrSize / 2, qrY - 13);
                
                    // QRコードの下に「Scan for confirmation」を描画
                    ctx.font = `9px ${police}`; 
                    ctx.fillText("Scan for confirmation", qrX + qrSize / 2, qrY + qrSize + 5);
                };
            }
        };
    };


    const handleDownload = () => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // a タグを作る。
            const a = document.createElement('a');
            // 保存する画像データをセットする。
            a.href = canvas.toDataURL();
    
            // // (参考) href の内容は DataURL 形式のテキストです。
            // console.log(a.href);
    
            // ファイル名をセットする。
            a.download = 'invitation.png';
            // a タグをクリックする。リンクをクリックする動作になります。
            a.click();
        }
        catch(e){
            console.error(e);
            alert(`エラー:${ e }`);
        }
    }



    return (

        <div className='container mt-5 mb-5'> 
            <div className='row  g-0'>

                {/* dropdown child year */}
                {userId && (
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
                                                key={child.idChild} 
                                                onClick={() => handleSelect(child)}>
                                                {child.childName}
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
                )}

            </div>
            <div className='row  g-0'>
                <div className='col-md-3'>

                    <div className='d-flex flex-column w-100 justify-content-center mt-4'>
                        <div className='d-flex align-items-center  mt-4 ms-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-1-square" viewBox="0 0 16 16">
                                <path d="M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"/>
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            </svg>
                            <div className='ms-2'>Enter the party details.</div>
                        </div>


                        
                        {/* card party */}

                        <div className='card mt-3'>
                                <div className='card-header p-4'>    
                                    <div>
                                        <div className='d-flex justify-content-center align-items-end'>
                                        {userId ? (
                                            <div>
                                                <div className='fs-3 me-4'>{partyValue.childName}</div>
                                                <div className='fs-5'>{partyValue.childYears} years old</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <input id='childName' type='text' placeholder='Child name'className='form-control' value={partyValue.childName}
                                                    onChange={event => handleChange('childName', event.target.value)} />

                                                <div className='d-flex align-items-end mt-3'>
                                                <input id='childYears' type='text' placeholder=''className='form-control me-2' value={partyValue.childYears}
                                                style={{ width: '50px', textAlign: 'center' }}
                                                    onChange={event => handleChange('childYears', event.target.value)} />
                                                    years old
                                                </div>
                                            </div>

                                        )}

                                        </div>
                                    </div>
                                </div>
                                <div className='card-body p-3'>
                                    {/* error message */}
                                    <div>
                                        {errValidation && (
                                            <div className='text-danger mb-4 ms-3' style={{ whiteSpace: 'pre-wrap' }}>
                                                {errValidation}
                                            </div>
                                        )}
                                    </div>

                                    {/* Edit party */}                        
                                    {((isEdit && userId) || (userId && !selectedParty) || !userId)  ? (
                                            <div>
                                                <Form.Group>
                                                    <Form.Label className='mb-0'>Date:</Form.Label>
                                                    <Form.Control
                                                        type='date'
                                                        value={partyValue.partyDate || new Date().toISOString().split('T')[0]}
                                                        onChange={event => handleChange('partyDate', event.target.value)}
                                                    />
                                                    <Form.Label className='mt-1 mb-0'>From:</Form.Label>
                                                    <Form.Select
                                                        type='time'
                                                        value={partyValue.partyTimeFrom || '15:00'}
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
                                                        value={partyValue.partyTimeTo || '17:00'}
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
                                                <input id='partyPlace' type='text' placeholder=''className='form-control ' value={partyValue.partyPlace}
                                                    onChange={event => handleChange('partyPlace', event.target.value)} />

                                                <input id='partyPlace2' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace2}
                                                    onChange={event => handleChange('partyPlace2', event.target.value)} />

                                                <input id='partyPlace3' type='text' placeholder=''className='form-control mt-1' value={partyValue.partyPlace3}
                                                    onChange={event => handleChange('partyPlace3', event.target.value)} />
                    
                                                <label className='me-3 mt-1' htmlFor='partyContact1'>Contact1: </label>
                                                <input id='partyContact1' type='text' placeholder=''className='form-control' value={partyValue.partyContact1}
                                                    onChange={event => handleChange('partyContact1', event.target.value)} />

                                                <label className='me-3 mt-1' htmlFor='partyContact2'>Contact2: </label>
                                                <input id='partyContact2' type='text' placeholder=''className='form-control' value={partyValue.partyContact2}
                                                    onChange={event => handleChange('partyContact2', event.target.value)} />

                                            </div>

                                    ) : (

                                            <div>
                                                <div>Date:</div>
                                                <div className='fs-5 d-flex'> {partyValue.partyDate2}</div>
                                                <div className='mt-3'>Time:</div>
                                                <div className='fs-6 d-flex'>{partyValue.partyTimeFrom || <>&nbsp;</>} ~ {partyValue.partyTimeTo}</div>
                                                <div className='mt-3'>Location:</div>
                                                    <div className='fs-5 d-flex flex-column'>
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
                                                <div className='mt-3'>Contact1:</div>
                                                <div className='fs-5 d-flex'>
                                                    {partyValue.partyContact1 || <>&nbsp;</>}
                                                </div>
                                                <div className='mt-3'>Contact2:</div>
                                                <div className='fs-5 d-flex'>
                                                    {partyValue.partyContact2 || <>&nbsp;</>}
                                                </div>
                                            </div>
                                        )}
                                            { userId && (
                                                <div className='d-flex justify-content-end mt-3 me-3'>
                                                    {isEdit && (
                                                        <div className=' me-2'>
                                                            <span className='text-danger me-3' style={{ cursor: 'pointer' }} 
                                                                onClick={() => {setIsEdit(false); setErrValidation([]);}}>
                                                                cancel
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Edit Delete */}
                                                    {new Date(partyValue.partyDate) > new Date() && (
                                                        <div className=' me-2'>
                                                            <span className='text-primary' style={{ cursor: 'pointer' }} 
                                                                onClick={isEdit ? handleUpdate : handleEdit}>
                                                                {isEdit ? 'Update' : 'Edit'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-5'>
                    <div className='mt-5 ms-3'>
                        <div className='d-flex align-items-center ms-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-2-square" viewBox="0 0 16 16">
                                <path d="M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306"/>
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            </svg>
                            <div className='ms-2'>Select a template card.</div>
                        </div>

                        {/* template images */}
                        <div className='d-flex flex-wrap p-3'>
                            <img src={card_1} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_1, qrCodeImg, 'Arial', '#e2377a', 220)} />

                            <img src={card_2} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_2, qrCodeImg, 'Alice', '#e2377a', 220)} />

                            <img src={card_3} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_3, qrCodeImg, 'Century Gothic', '#0ff486', 240)} />

                            {/* <img src={card_4} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_4, qrCodeImg, 'Consolas', 'black')} />

                            <img src={card_5} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_5, qrCodeImg, 'Alice', '#8b55f7')} /> */}

                            <img src={card_9} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_9, qrCodeImg, 'Century Gothic', '#6f2eee', 240)} />

                            <img src={card_10} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_10, qrCodeImg, 'Century Gothic', '#e2377a', 230)} />

                            <img src={card_11} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_11, qrCodeImg, 'Arial', 'black', 240)} />

                            <img src={card_12} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_12, qrCodeImg, 'Arial', '#e2377a', 220)} />

                            <img src={card_13} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_13, qrCodeImg, 'Arial', '#545454', 230)} />

                            <img src={card_14} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_14, qrCodeImg, 'Alice', '#004aad', 230)} />

                            <img src={card_15} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_15, qrCodeImg, 'Arial', '#e2377a', 220)} />

                            <img src={card_16} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_16, qrCodeImg, 'Century Gothic', '#fdab2e', 230)} />

                            <img src={card_17} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_17, qrCodeImg, 'Times New Roman', '#013477', 240)} />

                            <img src={card_18} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_18, qrCodeImg, 'Impact', '#4a3d35', 240)} />

                            <img src={card_19} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_19, qrCodeImg, 'Impact', '#545454', 240)} />

                            <img src={card_20} className='img-thumbnail ms-1 me-1  mb-3' style={{ width: "150px" }}
                                    onClick={() => selectTemplate(card_20, qrCodeImg, 'Impact', 'black', 220)} />

                        </div>

                    </div>
                </div>
                <div className='col-md-4'>
                        <div className='d-flex align-items-center mt-5 ms-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-3-square" viewBox="0 0 16 16">
                                <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318"/>
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            </svg>
                            <div className='ms-2'>Print out the invitation card.</div>
                        </div>
                    {/* create card */}
                    <div className='mt-3'>
                        <canvas ref={canvasRef} className='border' style={{ width: '350px', height: '500px' }}></canvas>
                    </div>

                    <button className='btn btn-outline-secondary' onClick={handleDownload}>Download</button>
                    <div>
                        <div>
                            {/* create QRcode */}
                            <Qrcode partyId={selectedParty} onQeCodeGenerated={handleQrCodeGenerated}/>
                        </div>

                    </div>

                </div>
            </div>
        </div>


  )
}

export default CreateCard
