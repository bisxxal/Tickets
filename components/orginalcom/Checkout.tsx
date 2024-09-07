 
import { IEvent } from '@/lib/models/event.model';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { cheakOutOrder } from '@/lib/actions/order.actions';

type CheckoutProps = {
  event: IEvent;
  userId: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function Checkout({ event, userId }: CheckoutProps) {
  useEffect(() => { 
    
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) { 
    }

    if (query.get('canceled')) { 
    }
  }, []);

  const onCheakOut = async () => {
    const order = {
      eventId: event._id,
      eventTitle: event.title,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    try {
      const url = await cheakOutOrder(order);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <Button
      onClick={onCheakOut}
      role="link"
      size="lg"
      className="rounded-full bg-pink-60 bg-[#db27782e] inshadow"
    >
      {event?.isFree ? 'Get Ticket' : 'Book Ticket'}
    </Button>
  );
}

export default Checkout;
