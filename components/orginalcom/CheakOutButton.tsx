"use client"
import { IEvent } from '@/lib/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import Checkout from './Checkout';

function CheakOutButton({event }:{event : IEvent}) {
    const {user} = useUser();
    const userId = user?.publicMetadata?.userId as string

    console.log(userId);
    
    const hasEventFinished = new Date(event.endDateTime) < new Date()
  return (
    <div className="flex items-center gap-3">
    {hasEventFinished ? (
      <p className="p-2 text-red-500">Sorry, tickets are no longer available.</p>
    ): (
      <>
        <SignedOut>
          <Button asChild className="button bg-pink-600 rounded-full" size="lg">
            <Link href="/sign-in">
              Get Tickets
            </Link>
          </Button>
        </SignedOut>

        <SignedIn>
          <Checkout event={event} userId={userId} />
        </SignedIn>
      </>
    )}
  </div>
  )
}

export default CheakOutButton