import { IEvent } from '@/lib/models/event.model'
import React from 'react'
import Card from './Card'
type CollectionProps = {
    data: IEvent[],
    emptyTitle: string,
    emptyStateSubtext: string,
    limit: number,
    page: number | string,
    totalPages?: number,
    urlParamName?: string,
    collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events'
  }
  
function Collection({data ,emptyTitle ,emptyStateSubtext ,collectionType ,limit ,page ,totalPages}:CollectionProps) {
    return (
        <div>
            {
                data.length>0 ?  (
                <div className='flex  items-center max-lg:flex-col w-full '> 
                 {
                    data.map((event,index)=>{
                        const hasOrderLink = collectionType === 'Events_Organized'
                        const hasTicketLink = collectionType === 'My_Tickets' 
                        return(
                            <div className='w-full flex flex-wrap justify-center items-center gap-5 px-2 ' key={index}>
                                <Card event={event} hasOrderLink={hasOrderLink} hasTicketLink={hasTicketLink} />
                            </div>
                        )
                    })
                }
                </div>
                ) 
                
                : (<div> <h3>{emptyTitle} </h3> <p>{emptyStateSubtext}</p> </div>)
            }
        </div>
    )
}

export default Collection