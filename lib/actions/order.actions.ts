'use server'
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { connectToDatabase } from "../database"
import Order from "../models/order.model"
import Stripe from 'stripe' 
import Event from "../models/event.model"
import User from "../models/user.models" 
import {ObjectId} from 'mongodb';

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
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/succes/payture`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/succes/payfalse`,
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

  export const createOrder = async (order: CreateOrderParams) => {
    try {
      await connectToDatabase();
      
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

  export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
    try {
      await connectToDatabase()
 

      if (!eventId) throw new Error('Event ID is required');
      const eventObjectId = new ObjectId(eventId);
            
    const orders = await Order.find({ event: eventObjectId })
    .populate({ path: 'buyer', model: User, select: '_id firstName lastName' }) // Populate buyer
      .populate({ path: 'event', model: Event, select: '_id title' }) // Populate event
      .lean();
 
      
    const filteredOrders = orders.filter(order => {
      if (!order.buyer) return false; // Skip orders without a buyer
      const buyerName = `${order.buyer.firstName} ${order.buyer.lastName}`;
      return new RegExp(searchString, 'i').test(buyerName);
    });

    const formattedOrders = filteredOrders.map(order => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      eventTitle: order.event.title,
      eventId: order.event._id,
      buyer: `${order.buyer.firstName} ${order.buyer.lastName}`,
    }));

    return JSON.parse(JSON.stringify(formattedOrders)); 

    } catch (error) {
        console.log('error at getOrdersByEvent route', error)
    }
  }