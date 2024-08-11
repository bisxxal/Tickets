import Collection from "@/components/orginalcom/Collection";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const events = await getAllEvents({
    query: "",
    limit: 6,
    page: 1,
    category: "",
  });
 

  return (
    <div className="   bg-[#13131a] min-h-screen text-white pb-20">
      <main className=" max-lg:px-3 px-24 flex max-lg:flex-col justify-between mb-20 ">
        <div className=" w-1/2 flex flex-col pt-20 max-lg:text-4xl max-lg:w-full text-[100px] font-bold leading-none  ">
          <h1>
            {" "}
            Book You <span className=" text-pink-600 ">Tickets </span> Now
          </h1>
          <p className=" font-normal mt-10 text-sm">
            Get ready for an unforgettable experience! Purchase your tickets now
            to secure your spot at Your Ticket .
          </p>

          <Link href={"/"}>
            {" "}
            <Button className=" border hover:border-2 border-pink-600 rounded-xl">
              {" "}
              Get Your Ticket{" "}
            </Button>{" "}
          </Link>
        </div>

        <div className=" w-1/2 max-lg:w-full flex justify-end ">
          <Image
            className=" w-[80%] h-full "
            src="/bg.svg"
            width={500}
            height={500}
            alt="hero"
          />
        </div>
      </main>
      <Collection
        //data={relatedEvents?.data}
        data={events?.data}
        emptyTitle="No Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={3}
        page={1}
        //   page={searchParams.page as string}
        totalPages={3}
        //   totalPages={relatedEvents?.totalPages}
      />
    </div>
  );
}
