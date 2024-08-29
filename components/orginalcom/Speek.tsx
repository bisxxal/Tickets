'use client'
import { useState } from 'react';
import { VolumeHigh } from 'iconsax-react';

function Speek({ data }: any) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else { 
            const speech = new SpeechSynthesisUtterance();
            speech.text = data;
            speech.volume = 1;  
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
            setIsSpeaking(true);
 
            speech.onend = () => setIsSpeaking(false);
        }
    };

    return (
        <div 
            onClick={speak} 
            className='px-2 py-2 bg-[#ffffff05] inshadow rounded-xl border-[2px] w-fit border-[#ffffff2d] flex gap-3 items-center cursor-pointer'>
            {isSpeaking ? 'Stop Listening' : ('Listen about Description' )}
            <VolumeHigh size="24" />
        </div>
    );
}

export default Speek;
