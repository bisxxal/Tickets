import { IEvent } from "@/lib/models/event.model";
import React from "react";
import Card from "./Card";
import Pagination from "./Pagination";
import { formatDateTime } from "@/lib/utils";
type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events"; 
};

function Collection({
  data,
  emptyTitle,
  emptyStateSubtext,
  urlParamName,
  collectionType,
  limit,
  page,
  totalPages ,
 
}: CollectionProps) { 
  return (
    <div> 
      {data && data.length > 0 ? (
        <>
          <div className=" flex justify-between max-lg:gap-10 gap-3 flex-wrap items-center max-lg:flex-col w-full ">
            {data.map((event, index) => {
              const hasOrderLink = collectionType === "Events_Organized";
              const hasTicketLink = collectionType === "My_Tickets";
            
              return ( 

                <>
                <Card
                event={event}
                hasOrderLink={hasOrderLink}
                hasTicketLink={hasTicketLink}
                />  
                </>
              );
            })}

            </div>
            <div className=" w-full px-20 max-lg:px-4 mt-20">
              {totalPages && totalPages > 0 && (
                <Pagination
                  urlParamName={urlParamName}
                  page={page}
                  totalPages={totalPages}
                />
              )}
            </div>
        </>
      ) : (
        <div className=" flex justify-center items-center flex-col gap-3">
          {" "}
          <h3 className=" text-gray-400 ">{emptyTitle}! </h3> <p className=" text-gray-400 ">{emptyStateSubtext}</p>{" "}
        </div>
      )}
    </div>
  );
}

export default Collection;
