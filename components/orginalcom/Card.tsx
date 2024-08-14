import { IEvent } from '@/lib/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server' 
import Image from 'next/image' 
import React from 'react'
import Link from 'next/link'
import { ArrowRight3, Edit2 ,TimerStart ,User } from 'iconsax-react';
import { DeleteConfirmation } from './DeleteConfirmation'
 
type CardProps = {
    event: IEvent,
    hasOrderLink?: boolean,
    hasTicketLink?: boolean, 
}
function Card({event ,hasOrderLink ,hasTicketLink } :CardProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id.toString(); 
  return (
    <div className="group relative mb-4  max-lg:mb-0 border-l-[0.5px] border-t-[0.5px] border-[#ffffff47] max-lg:h-[370px] h-[470px] max-[395px]:w-[320px] w-[360px]  overflow-hidden rounded-3xl bg-[#ffffff0f] shadow-md transition-all hover:shadow-lg hover:scale-[1.02 hover:translate-y-[-5px]  ">
     
     <div className=' absolute -bottom-2 rounded-full blur-[100px] -right-5 bg-[#1a57f1] h-32 w-32 '></div>
     <div className=' absolute -bottom-2 rounded-full blur-[100px] -left-5 bg-[#cd1af16d] h-32 w-32 '></div>
    <Link  href={`/events/${event._id}`}>
      <Image className=' h-[260px] max-lg:h-[199px] w-full object-cover ' src={event?.imageUrl} alt='' height={456} width={234}  /> 
    </Link>
    
    {isEventCreator && !hasTicketLink && (
      <div className="absolute right-2 top-2 flex gap-2 items-center rounded-xl bg-white p-1 shadow-lg transition-all">
        <Link href={`/events/${event._id}/update`} >
        <Edit2 size="25" color="black"/>
        </Link>
  
       <h1 className=' border-l-[2px] border-[#00000078] pl-2 '> <DeleteConfirmation eventId={event._id} /></h1>
      </div>
    )}
  
    <div className="flex flex-col gap-2 p-5 min-h-[230px] md:gap-4">
      {!hasTicketLink && (
        <div className="flex gap-2">
          <span className=" capitalize w-min rounded-full px-4 py-1 bg-[#00ff5e39] border border-green-400">
            {event.isFree ? 'FREE' : `${event.price}`}
          </span>
          <p className=" capitalize w-min rounded-full bg-[#8080803a] border border-zinc-400 px-4 py-1 text-gray-200 line-clamp-1">
            {event.category.name}
          </p>
        </div>
      )}

   <Link href={`/events/${event._id}`}>
        <p className=" text-lg font-bold md:p-medium-20 line-clamp-2 flex-1">{event.title}</p>
      </Link>
      <p className=" text-sm flex items-center gap-2 md:p-medium-18 text-gray-400">
      <TimerStart
      size="20"
      color="#d9e3f0"
      />  {formatDateTime(event.startDateTime).dateTime}
      </p>
  
     
  
      <div className="flex justify-between w-full">
        <p className=" text-sm flex items-center gap-2 font-semibold text-gray-300"> 
          <User
          color="#d9e3f0"
          size={20}
          />
          {event.organizer.firstName} {event.organizer.lastName}
        </p>
  
 
        {hasOrderLink && (
          <Link href={`/orders?eventId=${event._id}`} className="flex bg-[#00a2ff26] border-[#1d96ff] border-[1.2px] rounded-xl px-4 py-2 gap-2">
            <p className=" text-sm flex items-center">Order Details <ArrowRight3 color="#d9e3f0"/> </p>
          </Link>
        )}
      </div>
    </div>
  </div>
  
  )
}

export default Card