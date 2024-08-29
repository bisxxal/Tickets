// import React from 'react'

// function TicketForFilter() {
//   return (
  // <Select onValueChange={(value: string) => onSelectCategory(value)}>
    //   <SelectTrigger className="select-field bg-[#0d0d12] py-7 rounded-xl max-lg:mb-4 border-none ">
    //     <SelectValue placeholder="Ticket For" />
    //   </SelectTrigger>
    //   <SelectContent className=" bg-[#ffffff24] text-white  border-[#ffffff42] border rounded-xl backdrop-blur-[30px]">
    //     <SelectItem value="All" className=" border-none rounded-xl p-regular-14">All</SelectItem>

    //     {categories.map((category) => (
    //       <SelectItem value={category.name} key={category._id} className="select-item p-regular-14">
    //         {category.name}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>
//   )
// }

// export default TicketForFilter

"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories, getAllTicket } from "@/lib/actions/category.actions"; 
import { ICategory } from "@/lib/models/category.model";
import { ITicketFor } from "@/lib/models/ticketfor.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TicketForFilter = () => {
  const [categories, setCategories] = useState<ITicketFor[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // console.log(searchParams.toString());

  const IsSelected = searchParams.toString()
  
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllTicket();
      categoryList && setCategories(categoryList as ITicketFor[])
    }
    getCategories();
  }, [])

  const onSelectCategory = (category: string) => {
      let newUrl = '';

      if(category && category !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'ticketfor',
          value: category
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['ticketfor']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
  
   <section className=" w-[90%] rounded-xl mb-10 mx-auto h-14 bg-[#ffffff05] inshadow flex gap-20 max-lg:gap-4 max-[474px]:gap-2 justify-center items-center  text-lg max-md:text-sm  ">

<h1
 className={`cursor-pointer ${!searchParams.get('ticketfor') ? 'text-blue-500 border-b-[2px] border-blue-500 font-semibold' : ''}`}
 onClick={() => onSelectCategory('All')}
      >
        All
      </h1>

   {categories.map((category) => (
          <div  key={category._id} className="select-item cursor-pointer  rounded-xl  px-6 max-md:px-2  flex p-regular-14">

            <h1 className={`${IsSelected === `ticketfor=${category.name}` ? ' text-blue-500 border-b-[2px] border-blue-500  font-semibold ':' ' } `} onClick={()=>onSelectCategory(category.name)}>   {category.name} </h1>
         
          </div>
        ))}
   </section>
)
}

export default TicketForFilter