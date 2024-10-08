 
// 'use client';

// import { getEventByAI } from '@/lib/actions/event.actions';
// import { ICategory } from '@/lib/models/category.model';
// import { IEvent } from '@/lib/models/event.model';
// import { useState } from 'react';
// import CheakOutButton from './CheakOutButton';
// import { Location } from 'iconsax-react';
// import { formatDateTime } from '@/lib/utils';
// import Link from 'next/link';
// import Image from 'next/image';

// type Step = 'start' | 'category' | 'location' | 'confirm';

// interface AiProps {
//   categories: ICategory[];
//   locations: string[];
// }

// function Ai({ categories, locations }: AiProps) {
//   const [step, setStep] = useState<Step>('start');
//   const [category, setCategory] = useState<ICategory | null>(null);
//   const [location, setLocation] = useState<string>('');
//   const [events, setEvents] = useState<IEvent | null>(null);

//   const handleCategorySelection = (selectedCategory: ICategory) => {
//     setCategory(selectedCategory);
//     setStep('location');
//   };

//   const handleLocationChange = (loc: string) => {
//     setLocation(loc);
//     handleConfirmation();
//   };

//   const handleConfirmation = () => {
//     setStep('confirm');
//   };

//   const reset = () => {
//     setStep('start');
//     setCategory(null);
//     setLocation('');
//     setEvents(null);
//   };

//   const handelSumbit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!category || !location) return;

//     try {
//       const fetchedEvents = await getEventByAI({
//         title: category.name,
//         location,
//       });
//       setEvents(fetchedEvents);  
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center gap-3 text-white bg-[#13131a] w-full overflow-hidden h-screen">
//         <h1 className=' text-l font-semibold'>Book your ticket with <span className=' bg-zinc-700 px-2 rounded-xl '>AI</span> just answering simple Question .. </h1>
//       <div className="relative bg-[#0c0c11] w-[350px] rounded-xl min-h-[90vh] p-4">
//         {step === 'start' && (
//           <div className="flex flex-col items-center">
//             <h2 className="text-lg mb-4">What would you like to do?</h2>
//             <button
//               type="button"
//               onClick={() => setStep('category')}
//               className=" px-5 py-2 inshadow bg-[#ffffff09] border rounded-full border-zinc-800 hover:bg-zinc-800"
//             >
//               Book a Ticket for
//             </button>

//             <Link className='mt-4 px-5 py-2 inshadow bg-[#ffffff09] border rounded-full border-zinc-800 hover:bg-zinc-800 '  href={'/events'} >See all Events</Link>
//           </div>
//         )}

//         {step === 'category' && (
//           <>
//             <h2 className="text-lg mb-4 text-center">Select a Category:</h2>
//             <div className="flex searchbg items-center overflow-x-auto">
//               {categories.map((cat) => (
//                 <button
//                   key={cat._id}
//                   type="button"
//                   onClick={() => handleCategorySelection(cat)}
//                   className="  px-5 py-2 inshadow bg-[#ffffff09] m-1 mb-6 border rounded-full border-zinc-800 hover:bg-zinc-800"
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {step === 'location' && (
//           <>
//             <h2 className="text-lg mb-4">Enter Destination:</h2>
//             <div className="flex searchbg overflow-y-auto items-center">
//               {locations.map((loc, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => handleLocationChange(loc)}
//                   className=" px-5 py-2 inshadow bg-[#ffffff09] m-2 mx-1 mb-6 border whitespace-nowrap rounded-full border-zinc-800 hover:bg-zinc-800"
//                 >
//                   {loc}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {step === 'confirm' && (
//           <div className="flex flex-col items-center">
//             <h2 className="text-lg mb-4">Confirm your Booking</h2>

//             {events ? (
//               <div className="bg-[#2828284b] w-full overflow-hidden pb-3 rounded-xl">
//                 <Image className="w-full max-h-[300px]" src={events?.imageUrl} alt="" height={290} width={290} />
//                 <div className="text-sm flex flex-col gap-2 px-6 mt-3">
//                   <h1>{events?.title}</h1>
//                   <p>₹ {events?.price}</p>
//                   <p className=' text-zinc-400 text-sm mt-4'>
//                 Stating Date: -  {formatDateTime(events?.startDateTime).dateOnly} - {' '}
//                   {formatDateTime(events?.startDateTime).timeOnly}
//                 </p>

//                   <p>Category: {category?.name}</p>
//                   <p className=' items-center gap-1 flex'><Location color="#d9e3f0" size={20} variant="TwoTone"/>  {location}</p>
//                 </div>
//               </div>
//             ) : (
//                 <button
//                 type="button"
//                 onClick={handelSumbit}
//                 className=" px-5 py-2 inshadow bg-[#22c55e39] hover:bg-[#22c55ed0] border whitespace-nowrap rounded-full border-zinc-800"
//               >
//                 Search
//               </button>
//             )}
//             <div className="flex gap-2 mt-4">
//               <button
//                 type="button"
//                 onClick={reset}
//                 className=" px-5 py-1 inshadow bg-[#ffffff09] border whitespace-nowrap rounded-full border-zinc-800 hover:bg-zinc-800"
//               >
//                 Start Over
//               </button>
             
//               {events && <CheakOutButton event={events} />}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Ai;

'use client';

import React, { useState } from 'react';
 
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

const Ai: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleStart = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript((prevTranscript) => prevTranscript + ' ' + transcriptText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setTranscript('');
      setIsListening(true);
    } else {
      alert('Speech Recognition API is not supported in this browser.');
    }
  };

  const handleStop = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Speech to Text Converter</h1>
      <button onClick={handleStart} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={handleStop} disabled={!isListening}>
        Stop Listening
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>Transcript:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default Ai;
