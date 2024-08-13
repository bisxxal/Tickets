import { Ticket } from "iconsax-react"
import Link from "next/link"

function Fotter() {
  return (
    <div className=' w-full h-[50px] items-center bg-[#191b24] flex-col bg-[#333338 min-h-[50vh] text-white flex  justify-center px-3'>

      <Link href={"/"} className=" flex items-center font-semibold mb-20 max-lg:flex-col text-4xl gap-3"> 
      <Ticket size="52" color="#0a73fd" variant="Bulk"/> Tickets <h2 className=" max-lg:text-base"> / Get Your Tickets Now </h2> 
      </Link>
      <p className=" w-[80%] text-xs text-center ">Copyright 2024 Bigtree Entertainment Pvt. Ltd. All Rights Reserved.
The content and images used on this site are copyright protected and copyrights vests with the respective owners The usage of the content and images on this website is Intended to promote the works and no endorsement of the artist shall be implied. unauthorized use is prohibited and
punishable by law.</p>
    </div>
  )
}

export default Fotter