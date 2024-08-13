import Collection from '@/components/orginalcom/Collection'
import { Button } from '@/components/ui/button'
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Category, Link1, Location } from 'iconsax-react';
import CheakOutButton from '@/components/orginalcom/CheakOutButton'
async function EventDetails({params : {id} ,searchParams }:SearchParamProps) {
 const event = await getEventById(id)

 const relatedEvents = await getRelatedEventsByCategory({
  categoryId: event.category._id,
  eventId: event._id,
  page: searchParams.page as string,
 }) 
  return (
    <div className="bg-[#13131a] text-white w-full min-h-screen ">

        <div className=' flex max-lg:gap-3 gap-10 max-lg:flex-col min-h-screen w-full'>
            <div className=' w-[40%] max-lg:h-[50vh] max-lg:w-full px-10 max-lg:px-4 py-4 flex flex-col items-start gap-4 '>
             <img src={event?.imageUrl} className='   h-[560px] rounded-2xl object-cover w-full' alt="" />
             <div className=' flex gap-5 items-center '>
             <p className=' bg-[#00ff5e39] border border-green-400 px-4 py-1 rounded-full'> {event?.isFree ? 'Free' :`₹ ${event?.price}` } </p>
             <h3 className=' bg-[#8080803a] border border-zinc-400 px-4 py-1 rounded-full'>{event?.category.name}</h3>
           
             </div>
              </div>
            <div className=' bg-[#00000033] rounded-2xl max-lg:mt-0 mt-4 max-lg:w-full w-1/2 max-lg:px-2 px-10 max-lg:pl-5 py-4 '>
            <h1 className=' mt-10 text-[50px] max-lg:text-4xl max-lg:text-center font-semibold'>{event?.title}</h1>
            
            <div>
            <p className=' text-zinc-400 text-sm mt-4'>
                Stating Date: -  {formatDateTime(event?.startDateTime).dateOnly} - {' '}
                  {formatDateTime(event?.startDateTime).timeOnly}
                </p>
                <p className=' text-zinc-400 text-sm my-2 mb-4'>
                Ending Date: - 
                  {formatDateTime(event?.endDateTime).dateOnly} -  {' '}
                  {formatDateTime(event?.endDateTime).timeOnly}
                </p>
                <h4 className='font-semibold mb-4 flex items-center gap-2'> <Location color="#d9e3f0" variant="TwoTone"/> {event?.location}</h4>
            
            </div>
            <div>
            <h1 className=' text-lg font-medium mb-3'>About The Event : </h1>
            <h4 className=" text-sm text-zinc-400 mb-3">{event?.description}   </h4>
            </div>
            <Link href={event?.url} className=' line-clamp-1 bg-[#001eff23] px-3 border-[1.4px] border-blue-700  rounded-2xl py-1 flex items-center gap-2 my-4' > <Link1 color='#60a5fa ' variant="TwoTone"/> {event?.url.split(0,100)} </Link>
 
            <CheakOutButton event={event} />
            </div>
        </div>
        
        <section className="wrapper mt-10 min-h-[300px] flex bg-[#0f0f15]  flex-col justify-center px-20 max-lg:px-4 items-center gap-8 md:gap-12">
      <h2 className="font-bold text-2xl pt-10">Related Events</h2>

      <Collection 
          data={relatedEvents?.data} 
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string} 
          totalPages={relatedEvents?.totalPages}
        />
    </section>
      
    </div>
  )
}

export default EventDetails