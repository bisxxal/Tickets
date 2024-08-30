import { Sheet, SheetContent,  SheetTrigger,
} from "@/components/ui/sheet"
import NavItems from "./NavItems"
import { SidebarLeft } from "iconsax-react"


function MobileNav() {
  return (
    <div className=" hidden max-lg:block text- backdrop-blur-md bg-[#191b24] ">
      <Sheet >
    <SheetTrigger>
    <SidebarLeft size="32" color="#d9e3f0"/>
    </SheetTrigger>
    <SheetContent className="backdrop-blur-[6px]  text-white bg-[#ffffff60] ">
      <NavItems/>
    </SheetContent>
  </Sheet>
    </div>
  
  )
}

export default MobileNav