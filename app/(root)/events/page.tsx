import CategoryFilter from "@/components/orginalcom/CategoryFilter";
import Collection from "@/components/orginalcom/Collection";
import Search from "@/components/orginalcom/Search";
import TicketForFilter from "@/components/orginalcom/TicketForFilter";
import { getAllEvents, getAllEventsInPage } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";

 

async function EventAll({searchParams} :SearchParamProps) {

    const page = Number(searchParams.page) || 1;
    const searchText = (searchParams.query as string) || ""; 
    const category = (searchParams.category as string) || "";
    const ticketfor = (searchParams.ticketfor as string) || "";

    const events = await getAllEventsInPage({
        query: searchText,
        limit: 8,
        page,
        category: category,
        ticketfor: ticketfor
      });

  return (
    <div className='bg-[#13131a] text-white min-h-screen py-10 px-4'>
    <TicketForFilter/>
     <div className="flex w-fu mx-auto max-lg:flex-col max-lg:gap-1 gap-5 w-5/6  items-start  flex-row">
        <Search />
        <CategoryFilter />
    </div>


    <div className=" px-20 max-lg:px-0">
    <Collection 
        data={events?.data}
        emptyTitle="No Related Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={3}
          page={page } 
          totalPages={events?.totalPage}
      />    
    </div>
    
    </div>
  )
}

export default EventAll