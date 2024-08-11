import EventForm from "@/components/orginalcom/EventForm"; 
import { auth } from "@clerk/nextjs/server";
function CreateEvent(p0: { event: { imageUrl: string; title: string; description: string; location: string; startDateTime: Date; endDateTime: Date; categoryId: string; price: string; isFree: boolean; url: string; }; userId: string; path: string; }) {

  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;  
    return (
      <>
      <section className="  bg-[#13131a] w-full ">
        <h3 className=" text-3xl text-center py-5">Create event</h3>
      </section>
      <div className=" bg-[#13131a] px-24 max-lg:px-3 w-full min-h-screen">
        <EventForm userId={userId} type="Create" />
      </div>
      </>
    )
  }
  
  export default CreateEvent