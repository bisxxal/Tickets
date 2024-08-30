import { Select, SelectContent, SelectItem, SelectTrigger,  SelectValue,
  } from "@/components/ui/select"
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { ICategory } from "@/lib/models/category.model"
import { startTransition, useEffect, useState } from "react"
import { Input } from "../ui/input"
import { createCategory, getAllCategories } from "@/lib/actions/category.actions"

type DropDownProps = {
  onChangeHandeler:()=>void
  value?:string
}                           
function DropDown({onChangeHandeler , value}:DropDownProps) {
    const [categories, setCategories] = useState <ICategory[]> ([])
    const [NewCategory, setNewCategory] = useState('')

    const handelAddCategory = async()=>{
      createCategory({
        categoryName: NewCategory.trim()
      })
        .then((category) => {
          setCategories((prevState) => [...prevState, category])
        })
    }

    useEffect(() => {
      const getCategories = async () => {
        const categoryList = await getAllCategories();
  
        categoryList && setCategories(categoryList as ICategory[])
      }
  
      getCategories();
    }, [])
  return (
    <Select onValueChange={onChangeHandeler} defaultValue={value}>
    <SelectTrigger className="w-[180px] rounded-xl border-none">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent className=" bg-[#ffffff24] text-white  border-[#ffffff42] border rounded-xl backdrop-blur-[30px]  ">
   { categories.length > 0 && categories.map((item)=>(
        <SelectItem key={item?._id} value={item?._id}>
            {item?.name}
        </SelectItem>
   ))
   }
   <AlertDialog >
  <AlertDialogTrigger>Add New Category</AlertDialogTrigger>
  <AlertDialogContent className=" bg-[#0d0f13] text-white  border-[#ffffff42] border rounded-2xl backdrop-blur-[30px]  ">
    <AlertDialogHeader >
      <AlertDialogTitle>New Category</AlertDialogTitle>
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

export default DropDown