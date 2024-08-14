import Collection from "@/components/orginalcom/Collection";
import Search from "@/components/orginalcom/Search";
import CategoryFilter from "@/components/orginalcom/CategoryFilter";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({searchParams} :SearchParamProps) {
  
  const page = Number(searchParams.page) || 1;
  const searchText = (searchParams.query as string) || ""; 
  const category = (searchParams.category as string) || "";

 const events = await getAllEvents({
    query: searchText,
    limit: 6,
    page,
    category: category,
  });
  return (
    <div className="   bg-[#13131a] min-h-screen text-white pb-20">
      <main className=" max-lg:px-3 px-24 flex max-lg:flex-col justify-between mb-20 ">
        <div className=" w-1/2 flex flex-col pt-20 max-lg:text-4xl max-lg:w-full text-[100px] font-bold leading-none  ">
          <h1>
            {" "}
            Book Your <span className=" text-pink-600 ">Tickets </span> Now
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

        <div className=" w-1/2 max-lg:w-full flex justify-end  ">
          <Image
            className=" w-[80%] h-full "
            src="/bg.svg"
            width={500}
            height={500}
            alt="hero"
          />
        </div>
      </main>
      <div className="flex w-full max-lg:flex-col max-lg:gap-1 gap-5 px-20 max-lg:px-2 items-start  flex-row">
          <Search />
          <CategoryFilter />
        </div>
    
    <div className=" flex  px-4 max-lg:px-0">
    <Collection 
        data={events?.data}
        emptyTitle="No Related Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={3}
          page={page } 
          totalPages={events?.totalPages}
      />
    </div>
    </div>
  );
}