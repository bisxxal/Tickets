import { IEvent } from '@/lib/models/event.model'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { loadStripe } from '@stripe/stripe-js';
import { cheakOutOrder } from '@/lib/actions/order.actions';

type CheckoutProps = {
    event: IEvent
    userId: string
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
function Checkout({event ,userId }:CheckoutProps) {
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);

    const onCheakOut = async () => {
        const order = {
            eventId: event._id,
            eventTitle: event.title,
            price: event.price,
            isFree : event.isFree,
            buyerId : userId
        }

        const url =  await cheakOutOrder(order)
        if (url) {
          window.location.href = url;
      }
    }
  return (
     <form action={onCheakOut} method='post'  >
        <Button type='submit' role='link' size='lg' className=' rounded-full bg-pink-600'  >
            {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
        </Button>
     </form>
  )
}

export default Checkout