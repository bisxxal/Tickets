import Collection from '@/components/orginalcom/Collection'
import { Button } from '@/components/ui/button'
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Category, Link1, Location } from 'iconsax-react';
import CheakOutButton from '@/components/orginalcom/CheakOutButton'
async function EventDetails({params : {id}}:SearchParamProps) {
 const event = await getEventById(id)

 const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: id,
    limit: 3,
    page: 1,
 }) 
 
  return (
    <div className="bg-[#13131a] w-full min-h-screen ">

        <div className=' flex gap-10 max-lg:flex-col min-h-screen w-full'>
            <div className=' w-[40%] max-lg:w-full px-10 py-4 flex flex-col items-start gap-4 '>
             <img src={event?.imageUrl} className='  h-[460px] object-cover w-full' alt="" />
             <div className=' flex gap-5 items-center '>
             <p className=' bg-green-400 px-4 py-1 rounded-full'> {event.isFree ? 'Free' :`₹ ${event?.price}` } </p>
             <h3 className=' bg-zinc-400 px-4 py-1 rounded-full'>{event?.category.name}</h3>
             {/* <h3 className=' bg-zinc-400 px-4 py-1 rounded-full'>{event?.organizer?.firstName} {event?.organizer?.lastName}</h3> */}
             </div>
              </div>
            <div className=' bg-[#00000033] max-lg:w-full w-1/2 px-10 py-4 '>
            <h1 className=' mt-10 text-[50px] font-semibold'>{event?.title}</h1>
            <h4 className=" ">{event?.description}</h4>
            <h4 className=' flex items-center gap-2'> <Location color="#d9e3f0" variant="TwoTone"/> {event?.location}</h4>
            
            <div>
            <p>
                Stating Date: -  {formatDateTime(event.startDateTime).dateOnly} - {' '}
                  {formatDateTime(event.startDateTime).timeOnly}
                </p>
                <p>
                Ending Date: - 
                  {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                  {formatDateTime(event.endDateTime).timeOnly}
                </p>
            </div>
            <Link href={event?.url} className=' flex items-center gap-2 text-blue-500 ' > <Link1 color='blue' variant="TwoTone"/> {event?.url.split(0,100)} </Link>

            {/* <Button className=' bg-pink-600 rounded-full mt-6'>Register</Button> */}

            <CheakOutButton event={event} />
            </div>
        </div>
        

        <section className="wrapper my-8 flex flex-col justify-center items-center gap-8 md:gap-12">
      <h2 className="h2-bold">Related Events</h2>

      <Collection 
          data={relatedEvents?.data} 
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={1}
          // page={searchParams.page as string}
          totalPages={3}
        //   totalPages={relatedEvents?.totalPages}
        />
    </section>
    </div>
  )
}

export default EventDetails