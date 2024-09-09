import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { Ticket } from "iconsax-react";

function Header() {
  return (
    <div className=" w-full h-[60px] items-center bg-[#191b24] text-white flex justify-between px-3">
      <div>
      
        <Link href={"/"} className=" logo flex items-center  font-bold text-3xl gap-3">
        <Ticket size="42"  color="#0a73fd" variant="Bulk"/> Tickets.
         </Link> 
      </div>

      <div className=" flex gap-5">
      <SignedIn>
          <nav className=" flex items-center between max-lg:hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className=" flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav/>
          </SignedIn>
          <SignedOut>
            <Button className=" border-[2px] border-[#ffffff58] inshadow bg-[#ffffff04] rounded-xl ">
              <Link href={"/sign-in"}>Login In</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

export default Header;
