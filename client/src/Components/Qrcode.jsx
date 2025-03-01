import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import rsvp from '../assets/rsvp.png';


function Qrcode({ partyId, onQeCodeGenerated }) {

    const [url, setUrl] = useState('');
    const qrRef = useRef(null);

    useEffect(() => {
        if (partyId) {
            setUrl(`http://127.0.0.1:3000/rsvp/${partyId}`)
         }
      }, [partyId]);

    
    useEffect (() => {
        if (url && qrRef.current) {
            const qrCanvas = qrRef.current.querySelector('canvas');
            if (qrCanvas) {
                const qrImage = qrCanvas.toDataURL('image/png');
                onQeCodeGenerated(qrImage); // return to parent component
            }
        }
    }, [url, onQeCodeGenerated]);


  return (
    <div ref={qrRef} style={{ display: 'none'}}>
            {url && (
                <QRCodeCanvas
                    value = {url}
                    size = {100}
                    level = 'H'
                    // imageSettings = {{
                    //     src: rsvp,
                    //     width: 30,
                    //     height: 30,
                    //     excavate: true,
                    // }}
                />
            )}
    </div>
  );
}

export default Qrcode
