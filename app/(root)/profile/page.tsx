import Collection from '@/components/orginalcom/Collection';
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions';
import { getOrdersByUser } from '@/lib/actions/order.actions';
import { IOrder } from '@/lib/models/order.model';
import { SearchParamProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
  
    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.eventsPage) || 1;
  
    const orders = await getOrdersByUser({ userId, page: ordersPage})

  
    const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
    const organizedEvents = await getEventsByUser({ userId, page: eventsPage })

     
  return (
    <>
    <div className=' px-20 max-lg:px-4 pb-20  text-white bg-[#13131a]  '>
    <section className=" max-lg:py-5 py-10  ">
    <div className="wrapper flex items-center justify-center sm:justify-between  ">
      <h3 className=' text-2xl  font-bold text-center sm:text-left'>My Tickets</h3>
      <Button asChild size="lg" className=" bg-pink-600 rounded-full  hidden sm:flex">
        <Link href="/#events">
          Explore More Events
        </Link>
      </Button> 
    </div> 
  </section>

  <section className="wrapper bg-[#00000038] w-full rounded-xl px-5  py-8  ">
    <Collection
      data={orderedEvents}
      emptyTitle="No event tickets purchased yet"
      emptyStateSubtext="No worries - plenty of exciting events to explore!"
      collectionType="My_Tickets"
      limit={3}
      page={ordersPage}
      urlParamName="ordersPage"
      totalPages={orders?.totalPages} 
      />
  </section> 
      
      </div>

      <section className="bg-[#0f0f14] text-white pt-20  bg-dotted-pattern bg-cover bg-center max-lg:py-5 py-10 ">
        <div className="wrapper flex items-center justify-center mb-16 px-10 sm:justify-between">
          <h3 className=' text-2xl  font-bold  text-center sm:text-left'>Events Organized</h3>
          <Button asChild size="lg" className="button hidden  bg-blue-600 rounded-full  sm:flex">
            <Link href="/events/create">
              Create New Event
            </Link>
          </Button>
        </div> 
       
       <div className=' px-4 w-full  '>

       <Collection 
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />

       </div>
      </section>
      </>
  )
}

export default ProfilePage