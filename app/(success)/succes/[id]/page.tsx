'use client'

import Link from "next/link"

function page({params}: any) {
  return (
    <div className='h-screen flex justify-center items-center bg-black text-zinc-200 '>

        <div className=" flex items-center justify-center flex-col gap-5">
        {params.id === 'payture' ? (    <img className="h-20 w-20" src="/done.png" alt="" /> ) :(    <img className="h-20 w-20" src="/cancel.png" alt="" /> ) }
         
            <h1> {params.id === 'payture' ? 'Payment Verified Ticket Booked' :'Payment not verified Ticket Canceled ' }</h1>

            {params.id === 'payture' ? (  <Link className=" border-[2px] border-[#ffffff70] px-5 py-2 rounded-xl" href={'/profile'}>Go To Profile</Link> ) :(   <Link className=" border-[2px] border-[#ffffff70] px-5 py-2 rounded-xl" href={'/'}>Go to Dashbord</Link>) }
         

        </div>
        
    </div>
  )
}

export default page