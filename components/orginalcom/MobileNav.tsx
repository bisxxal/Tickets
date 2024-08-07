import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import NavItems from "./NavItems"


function MobileNav() {
  return (
    <div className=" hidden max-lg:block bg-[#191b24] ">
      <Sheet >
    <SheetTrigger>=</SheetTrigger>
    <SheetContent>
      <NavItems/>
    </SheetContent>
  </Sheet>
    </div>
  
  )
}

export default MobileNav