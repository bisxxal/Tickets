// import React from 'react'

// function TicketForDropDown() {
//   return (
//     <div>TicketForDropDown</div>
//   )
// }

// export default TicketForDropDown


import { Select, SelectContent, SelectItem, SelectTrigger,  SelectValue,
} from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

 
import { startTransition, useEffect, useState } from "react"
import { Input } from "../ui/input"
import { createCategory, createTicketFor, getAllCategories, getAllTicket } from "@/lib/actions/category.actions"
import { ITicketFor } from "@/lib/models/ticketfor.model"

type DropDownProps = {
onChangeHandeler:()=>void
value?:string
}                           
function TicketForDropDown({onChangeHandeler , value}:DropDownProps) {
  const [ticket, setTicketFor] = useState <ITicketFor[]> ([])
  const [NewCategory, setNewCategory] = useState('')

  const handelAddCategory = async()=>{
   await createTicketFor({
      categoryName: NewCategory.trim()
    })
      .then((category) => {
        setTicketFor((prevState) => [...prevState, category])
      })
  }

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllTicket();

      categoryList && setTicketFor(categoryList as ITicketFor[])
    }

    getCategories();
  }, [])
return (
  <Select onValueChange={onChangeHandeler} defaultValue={value}>
  <SelectTrigger className="w-[180px] rounded-xl border-none">
    <SelectValue placeholder="Create Ticket For " />
  </SelectTrigger>
  <SelectContent className=" bg-[#ffffff24] text-white  border-[#ffffff42] border rounded-xl backdrop-blur-[30px]  ">
 { ticket.length > 0 && ticket.map((item)=>(
      <SelectItem key={item._id} value={item._id}>
          {item.name}
      </SelectItem>
 ))
 }
 <AlertDialog >
<AlertDialogTrigger>Add New Category</AlertDialogTrigger>
<AlertDialogContent className=" bg-[#0d0f13] text-white  border-[#ffffff42] border rounded-2xl backdrop-blur-[30px]  ">
  <AlertDialogHeader >
    <AlertDialogTitle>Add Ticketfor</AlertDialogTitle>
    <AlertDialogDescription  >
     <Input className=" rounded-xl " placeholder="Category Name" onChange={(e)=>setNewCategory(e.target.value)} />
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel className=" rounded-xl  ">Cancel</AlertDialogCancel>
    <AlertDialogAction className=" hover:bg-pink-600 bg-pink-600 rounded-xl" onClick={()=>startTransition(handelAddCategory)} >Add</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>

  </SelectContent>
</Select>

)
}

export default TicketForDropDown