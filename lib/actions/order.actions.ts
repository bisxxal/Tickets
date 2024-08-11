'use server'
import { CheckoutOrderParams, GetOrdersByUserParams } from "@/types"
import { connectToDatabase } from "../database"
import Order from "../models/order.model"
import Stripe from 'stripe' 
import Event from "../models/event.model"
import User from "../models/user.models" 

export async function cheakOutOrder(order: CheckoutOrderParams) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const price = order.isFree ? 0 :Number(order.price) * 100
    try {
        
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: 'inr',
                  unit_amount: price,
                  product_data: {
                    name: order.eventTitle,
                  },
                },
                quantity: 1,
              },
            ],
            metadata:{
                eventId: order.eventId,
                buyerId: order.buyerId
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
          }); 
         
          return session.url; 

    } catch (error) {
        console.log('error at cheakOutOrder route', error)
    }
}

export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
    try {
      await connectToDatabase()
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { buyer: userId }
  
      const orders = await Order.distinct('event._id')
        .find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
        .populate({
          path: 'event',
          model: Event, 
          populate: {
            path: 'organizer',
            model: User,  
            select: '_id firstName lastName',
          },
        })
  
      const ordersCount = await Order.distinct('event._id').countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
    } catch (error) {
        console.log('error at getOrdersByUser route', error)
    }
  }

 export async function createOrder(order: any) {
    try {
      await connectToDatabase()
    
    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
    } catch (error) {
        console.log('error at createOrder route', error)
    }

  }