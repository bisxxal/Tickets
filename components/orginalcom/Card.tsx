import { IEvent } from '@/lib/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server' 
import Image from 'next/image' 
import React from 'react'
import Link from 'next/link'
import { Edit2 ,TimerStart } from 'iconsax-react';
import { DeleteConfirmation } from './DeleteConfirmation'
 
type CardProps = {
    event: IEvent,
    hasOrderLink?: boolean,
    hasTicketLink?: boolean
}
function Card({event ,hasOrderLink ,hasTicketLink} :CardProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group relative  h-[470px] w-[360px]  overflow-hidden rounded-xl bg-[#ffffff0f] shadow-md transition-all hover:shadow-lg ">
     
    <Link  href={`/events/${event._id}`}>
      <Image className=' h-[260px] w-full object-cover ' src={event?.imageUrl} alt='' height={456} width={234}  /> 
    </Link>
    
    {isEventCreator && !hasTicketLink && (
      <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-1 shadow-lg transition-all">
        <Link href={`/events/${event._id}/update`} >
        <Edit2 size="25" color="black"/>
        </Link>
  
        <DeleteConfirmation eventId={event._id} />
      </div>
    )}
  
    <div className="flex flex-col gap-2 p-5 min-h-[230px] md:gap-4">
      {!hasTicketLink && (
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
            {event.isFree ? 'FREE' : `${event.price}`}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-200 line-clamp-1">
            {event.category.name}
          </p>
        </div>
      )}
  
      <p className="p-medium-16 flex items-center gap-2 md:p-medium-18 text-gray-200">
      <TimerStart
      size="23"
      color="#d9e3f0"
      />  {formatDateTime(event.startDateTime).dateTime}
      </p>
  
      <Link href={`/events/${event._id}`}>
        <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1">{event.title}</p>
      </Link>
  
      <div className="flex justify-between w-full">
        <p className="p-medium-14 md:p-medium-16 text-gray-300">
          {event.organizer.firstName} {event.organizer.lastName}
        </p>
  
        {hasOrderLink && (
          <Link href={`/orders?eventId=${event._id}`} className="flex bg-blue-600 rounded-xl px-4 py-2 gap-2">
            <p className="text-primary-500">Order Details</p>
          </Link>
        )}
      </div>
    </div>
  </div>
  
  )
}

export default Card