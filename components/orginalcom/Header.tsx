import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

function Header() {
  return (
    <div className=" w-full h-[50px] items-center bg-[#191b24] text-white flex justify-between px-3">
      <div>
        {" "}
        <Link href={"/"}>Your Ticket </Link>{" "}
      </div>

      <SignedIn>
          <nav className="md:flex-between max-lg:hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

      <div>
        <div className=" flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav/>
          </SignedIn>
          <SignedOut>
            <Button className=" border ">
              <Link href={"/sign-in"}>Login In</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

export default Header;
