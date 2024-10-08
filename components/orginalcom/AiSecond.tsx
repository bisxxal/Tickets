'use client';
import { getEventByAI } from '@/lib/actions/event.actions';
import { IEvent } from '@/lib/models/event.model';
import { formatDateTime } from '@/lib/utils';
import { Location } from 'iconsax-react';
import { useRef, useState } from 'react';
import CheakOutButton from './CheakOutButton';
import { IoSendSharp } from "react-icons/io5";
import Image from 'next/image';
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";

type ExtractedData = {
  category: string | null;
  location: string | null;
};

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

function useSentenceParser(setEvents: React.Dispatch<React.SetStateAction<IEvent | null | 'not'>>) {
  const [error, setError] = useState<string[]>([]);

  const addError = (message: string) => {
    setError((prevErrors) => [...prevErrors, message]);
  }; 

  const parseSentence = async (sentence: string): Promise<ExtractedData> => { 

    const trimmedSentence = sentence.trim().toLowerCase();
    if (['hi', 'hii', 'hello', '', ' ' , ' hi what’s up' , 'what’s up'].includes(trimmedSentence)) {
      addError('Hey! How’s it going? Would you like to book a ticket?');
      return { category: null, location: null };
    }

    if (['yes', 'ok', 'yaa', 'y'].includes(trimmedSentence)) {
      addError('Please enter the name and location.');
      return { category: null, location: null };
    }

    if (['tell me about yourself', 'who made you', 'tell me about you'].includes(trimmedSentence)) {
      addError('I was created by Bishal and team, for booking tickets only.');
      return { category: null, location: null };
    }

    const categoryMatch = sentence.match(/(?:ticket|tickets)\s+for\s+(\w+)/i);
    const locationMatch = sentence.match(/(?:location|located|place|placed|in|,)\s*(?:is|in\s*)?(\w+)/i);

    const category = categoryMatch ? categoryMatch[1] : null;
    const location = locationMatch ? locationMatch[1] : null;

    if (!category) addError('Please enter a name along with the location.');
    if (!location) addError('Please enter a location as well.');

    try {
      if (category && location) {
        const fetchedEvents = await getEventByAI({ title: category, location });
        if (fetchedEvents) {
          setEvents(fetchedEvents);
        } else {
          setEvents('not');
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      addError('Failed to fetch events. Please try again.');
    }

    return { category, location };
  };

  return { parseSentence, error };
}

function AiSecond() {
  const [events, setEvents] = useState<IEvent | null | 'not'>(null);
  const { parseSentence, error } = useSentenceParser(setEvents);
  const [result, setResult] = useState<ExtractedData | null>(null);

  const handleParse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sentence = formData.get('sentence') as string;

    const extractedData = await parseSentence(sentence);
    setResult(extractedData);
  };

 
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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

  // const handleStop = () => {
  //   const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  //   if (SpeechRecognition) {
  //     const recognition = new SpeechRecognition() as SpeechRecognition;
  //     recognition.stop();
  //     setIsListening(false);
  //   }
  // };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      recognitionRef.current = null; // Clear the reference
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-white bg-[#13131a] w-full overflow-hidden h-screen">
      <h1 className='text-l max-md:text-sm font-semibold'>
        Book your ticket with <span className='bg-zinc-700 px-2 rounded-xl'>AI</span> just ask a simple question ..
      </h1>

      <div className='relative bg-[#0c0c11] w-[350px] rounded-xl max-lg:hj-[84vh] min-h-[90vh] p-4 '>

      

   <div className=' flex items-center w-full justify-center'>
   <form onSubmit={handleParse} className=" w-[97%]">
        <div className="flex items-center rounded-xl overflow-hidden">
          <input
            className="p-2 text-sm inshadow h-full py-[10px] outline-none shadow bg-[#ffffff09] w-[95%]"
            name="sentence"
            type="text"
            defaultValue={transcript}
            placeholder="Enter your prompt"
          />
          <button type="submit" className="px-3 py-2 text-2xl inshadow bg-[#3b83f682] text-white">
            <IoSendSharp />
          </button>
        </div>
   </form>

  <div className=' bg-blue-400 p-1 h-full ml-1 flex items-center justify-center rounded-full  text-3xl'>
  {isListening ? (
        <button onClick={handleStop}>
          <FaMicrophoneSlash />
        </button>
      ) : (
        <button onClick={handleStart}>
         <FaMicrophone />
        </button>
      )}
  </div>
   </div>

          {error.length > 0 && (
          <div className=" mt-2 flex flex-col gap-2 ">
            {error.map((err, index) => (
              <p className=' px-5 py-2 bounce shadow bg-[#ffffff09]  border rounded text-xs   border-zinc-800 hover:bg-zinc-800' key={index}>{err}</p>
            ))}
          </div>
        )}

        {events && events !== 'not' && (
          <div className="bg-[#2828284b] w-full inshadow mt-6 mb-3 overflow-hidden pb-3 rounded-xl">
            <div className="h-[70%] w-full">
              <Image className='h-full w-full object-cover' src={events?.imageUrl} alt='' height={456} width={534} />
            </div>
            <div className="text-sm flex flex-col gap-2 px-6 mt-3">
              <h1>{events?.title}</h1>
              <p>₹ {events?.price}</p>
              <p className="text-zinc-400 text-sm mt-4">
                Starting Date: {formatDateTime(events?.startDateTime).dateOnly} - {formatDateTime(events?.startDateTime).timeOnly}
              </p>
              <p className="items-center gap-1 flex">
                <Location color="#d9e3f0" size={20} variant="TwoTone" /> {events?.location}
              </p>
            </div>
          </div>
        )}

        {events === 'not' && (
          <h1 className="text-center text-red-500 mt-4">Ticket for {result?.category} not available</h1>
        )}

        {events && events !== 'not' && <CheakOutButton event={events} />}
   </div>
    </div>
  );
}

export default AiSecond;
