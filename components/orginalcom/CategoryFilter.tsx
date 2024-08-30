"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/category.actions"; 
import { ICategory } from "@/lib/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[])
    }
    getCategories();
  }, [])

  const onSelectCategory = (category: string) => {
      let newUrl = '';

      if(category && category !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'category',
          value: category
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['category']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field bg-[#0d0d12 bg-[#ffffff05] inshadow py-7 rounded-xl max-lg:mb-4 border-none ">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent className=" bg-[#ffffff24] text-white  border-[#ffffff42] border-[2px] rounded-xl backdrop-blur-[30px]">
        <SelectItem value="All" className=" border-none rounded-xl p-regular-14">All</SelectItem>

        {categories?.map((category) => (
          <SelectItem value={category?.name} key={category?._id} className="select-item p-regular-14">
            {category?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CategoryFilter