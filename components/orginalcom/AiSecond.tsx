'use client';
import { getEventByAI } from '@/lib/actions/event.actions';
import { IEvent } from '@/lib/models/event.model';
import { formatDateTime } from '@/lib/utils';
import { Location } from 'iconsax-react';
import { useState } from 'react';
import CheakOutButton from './CheakOutButton';
import { IoSendSharp } from "react-icons/io5";

type ExtractedData = {
  category: string | null;
  location: string | null;
};

function useSentenceParser(setEvents: React.Dispatch<React.SetStateAction<IEvent | null | 'not'>>) {
  const [error, setError] = useState<string | null>(null);

  const parseSentence = async (sentence: string): Promise<ExtractedData> => {
    if (['hi', 'hii', 'hello',' ',''].includes(sentence.toLowerCase())) {
      setError('Hey! How’s it going? Would you like to book a ticket?');
      return { category: null, location: null };
    }

    if (['yes', 'ok' , 'yaa' ,'y'].includes(sentence.toLowerCase())) {
      setError('Please enter the name and location.');
      return { category: null, location: null };
    }
    if (['tell me about yourself', 'who made you' , 'tell me about you' ].includes(sentence.toLowerCase())) {
      setError('I was created by Bishal and team, for booking tickets only .');
      return { category: null, location: null };
    }

    const categoryMatch = sentence.match(/(?:ticket|tickets)\s+for\s+(\w+)/i);
    const locationMatch = sentence.match(/(?:location|located|place|placed|in|,)\s*(?:is|in\s*)?(\w+)/i);

    const category = categoryMatch ? categoryMatch[1] : null;
    const location = locationMatch ? locationMatch[1] : null;

    if (!category) setError('please enter name along location .');
    if (!location) setError('please enter Location also .');
    if (category && location) setError(null);

    try {
      if (category && location) {
        const fetchedEvents = await getEventByAI({ title:category, location });
        if (fetchedEvents) {
          setEvents(fetchedEvents);
        } else {
          setEvents('not');
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again.');
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
 

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-white bg-[#13131a] w-full overflow-hidden h-screen">
    <h1 className=' text-l font-semibold'>Book your ticket with <span className=' bg-zinc-700 px-2 rounded-xl '>AI</span> just ask simple Question .. </h1>

      <form onSubmit={handleParse} className="relative bg-[#0c0c11] w-[350px] rounded-xl min-h-[90vh] p-4">
        <div className="flex items-center rounded-xl overflow-hidden">
          <input className="p-2 text-sm inshadow h-full py-[10px] outline-none shadow bg-[#ffffff09] w-[95%]" name="sentence" type="text" placeholder="Enter your prompt" />
          <button type="submit" className="px-3 py-2 text-2xl inshadow bg-[#3b83f682] text-white">
            <IoSendSharp />
          </button>
        </div>

        {events && events !== 'not' && (
          <div className="bg-[#2828284b] w-full mt-6 mb-3 overflow-hidden pb-3 rounded-xl">
            <div className="max-w-[300px] w-full">
              <img className="w-full h-full" src={events?.imageUrl} alt="" />
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

        {error && (
          <p className="px-5 py-2 bounce shadow bg-[#ffffff09] m-1 mb-6 border rounded-xl text-xs mt-5 border-zinc-800 hover:bg-zinc-800">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default AiSecond;
