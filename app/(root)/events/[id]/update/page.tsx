import EventForm from "@/components/orginalcom/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { UpdateEventParams } from "@/types";
import { auth } from "@clerk/nextjs/server";

type UpdateEventProps = {
  params: {id:string}
}
async function UpdateEvent({params : {id}}:UpdateEventProps) {

  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;  

  const event = await getEventById(id)
    return (
      <>
      <section className=" text-white  bg-[#13131a] w-full ">
        <h3 className=" text-3xl text-center py-5">Update event</h3>
      </section>
      <div className=" bg-[#13131a] text-white px-24 max-lg:px-3 w-full min-h-screen">
        <EventForm userId={userId} event={event} eventId={event._id} type="Update" />
      </div>
      </>
    )
  }
  
  export default UpdateEvent