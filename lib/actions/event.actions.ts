"use server"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../models/user.models"
import Event from "../models/event.model"
import Category from "../models/category.model" 
import { revalidatePath } from "next/cache"
import TicketFor from "../models/ticketfor.model" 
import Fuse from 'fuse.js';
const populateEvent = async (query: any) => {
    return query
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
      .populate({ path: 'TicketFor', model: TicketFor, select: '_id name' });
};

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}
const getTicketForByName = async (name: string) => {
  return TicketFor.findOne({ name: { $regex: name, $options: 'i' } })
}

export const createEvent= async ({event, userId, path} :CreateEventParams ) => {
    try {
        await connectToDatabase()

        const organizer = await User.findById(userId)  

        if(!organizer) { throw new Error("Organizer not found")} 

        const newEvent = await Event.create({ ...event, category:event.categoryId ,TicketFor:event.TicketFor , organizer: userId })  
        return JSON.parse(JSON.stringify(newEvent))                         
    } catch (error) {
        console.log("eroor at creatEvent route ",error)
    }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
      await connectToDatabase()
  
      const eventToUpdate = await Event.findById(event._id)
      if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(
        event._id,
        { ...event, category: event.categoryId },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
      console.log('error at updateEvent route', error)
    }
  }
    // DELETE
  export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {
      await connectToDatabase()
  
      const deletedEvent = await Event.findByIdAndDelete(eventId)
      if (deletedEvent) revalidatePath(path)
    } catch (error) {
        console.log('error at deleteEvent route', error)
    }
  }
export const getEventById = async (eventId: string) => {
    try {
        await connectToDatabase() 
        const eventQuery = Event.findById(eventId);
 
        const event = await populateEvent(eventQuery) 

        if(!event) { throw new Error("Event not found")} 
        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        console.log("eroor at getEventById route--->> ",error)
    }
}
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
        await connectToDatabase() 
        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
          $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }

        const events = Event.find(conditions)
        .sort({createdAt: -1})
        .limit(limit)
        .skip((Number(page) - 1) * limit);

        const allEvents = await populateEvent(events)
        const eventsCount    = await Event.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(allEvents)),
            totalPage : Math.ceil(eventsCount / limit),
        }
          
    } catch (error) {
        console.log("eroor at getEventById route ",error)
    }
}

export async function getAllEventsInPage({ query, limit = 6, page, category, ticketfor }: GetAllEventsParams) {
  try {
      await connectToDatabase();
      
      const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {};
      const categoryCondition = category ? await getCategoryByName(category) : null;      
      const ticketforCondition = ticketfor ? await getTicketForByName(ticketfor) : null;
      
      const conditions = {
          $and: [
              titleCondition,
              categoryCondition ? { category: categoryCondition._id } : {},
              ticketforCondition ? { TicketFor: ticketforCondition._id } : {}
          ],
      };

      const events = Event.find(conditions)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip((Number(page) - 1) * limit);

      const allEvents = await populateEvent(events);
      
      const eventsCount = await Event.countDocuments(conditions);

      return {
          data: JSON.parse(JSON.stringify(allEvents)),
          totalPage: Math.ceil(eventsCount / limit),
      };

  } catch (error) {
      console.log("Error at getAllEventsInPage route", error);
  }
}


  export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
  }: GetRelatedEventsByCategoryParams) {
    try {
      await connectToDatabase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      console.log('error at getRelatedEventsByCategory route', error) 
    }
  }

  export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
      await connectToDatabase()
  
      const conditions = { organizer: userId }
      const skipAmount = (page - 1) * limit
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      console.log('error at getEventsByUser route', error)
    }
  }

  type GetEventByAiProps = {
    category?: string;
    location: string;
  }
 

// export async function getEventByAI({ category, location }: GetEventByAiProps) {
//   try {
//     await connectToDatabase();

//     const query: any = {};
 
//     let categoryId;
//     if (category) {
       
//       const allCategories = await Category.find().lean();


//       const fuseCategory = new Fuse(allCategories, {
//         keys: ['name'],   
//         threshold: 0.4,   
//         distance: 100,    
//       });

     
//       const categoryResult = fuseCategory.search(category);

       
//       if (categoryResult.length > 0) {
//         categoryId = categoryResult[0].item._id;
//         query.category = categoryId;
//       }
//     }

     
//     if (location) {
//       // Fetch all distinct locations from the Event collection
//       const allLocations = await Event.distinct('location');

       
//       const fuseLocation = new Fuse(allLocations, {
//         threshold: 0.4,   
//         distance: 100,    
//       });

      
//       const locationResult = fuseLocation.search(location);
 
//       if (locationResult.length > 0) {
//         query.location = locationResult[0].item;
//       }
//     }

   
//     const eventQuery = Event.findOne(query);
 
//     const event = await populateEvent(eventQuery);

//     return JSON.parse(JSON.stringify(event));
//   } catch (error) {
//     console.log('Error at getEventByAI route:', error);
//     return null;
//   }
// } 



 /// for name and locxation perfect match


// export async function getEventByAI({ title, location }: { title: string; location: string }) {
//   try {
//     await connectToDatabase();

//     const query: any = {};
 
//     if (title) { 
//       const allTitles = await Event.distinct('title').exec();
      
 
//       const formattedTitles = allTitles.map(title => title.toString());
 
//       const fuseTitle = new Fuse(formattedTitles, {
//         keys: [],  
//         threshold: 0.3, 
//         distance: 50,   
//       });
 
//       const titleResult = fuseTitle.search(title);
 
//       if (titleResult.length > 0) {
//         query.title = titleResult[0].item;
//       }
//     }
 
//     if (location) { 
//       const allLocations = await Event.distinct('location').exec();
       
//       const formattedLocations = allLocations.map(loc => loc.toString());
 
//       const fuseLocation = new Fuse(formattedLocations, {
//         keys: [],       
//         threshold: 0.2, 
//         distance: 50,   
//       });
 
//       const locationResult = fuseLocation.search(location);
 
//       if (locationResult.length > 0) {
//         query.location = locationResult[0].item;
//       }
//     } 
//     const eventQuery = Event.findOne(query);
 
//     const event = await populateEvent(eventQuery);

//     return JSON.parse(JSON.stringify(event));
//   } catch (error) {
//     console.log('Error at getEventByAI route:', error);
//     return null;
//   }
// }
 

export async function getEventByAI({ title, location }: { title: string; location: string }) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (title) {
      const allTitles = await Event.distinct('title').exec();
      const formattedTitles = allTitles.map(title => title.toString());
      const fuseTitle = new Fuse(formattedTitles, {
        threshold: 0.3,  
        distance: 50,    
      });
      const titleResult = fuseTitle.search(title);
      if (titleResult.length > 0) {
        query.title = titleResult[0].item;
      }
    }
 
    if (location) {
      const allLocations = await Event.distinct('location').exec();     
      const formattedLocations = allLocations.map(loc => loc.toString());
      if (formattedLocations.includes(location)) {
        return null;
      } 
      const locationWords = location.split(' ').slice(0, 4).join(' '); 
      const fuseLocation = new Fuse(formattedLocations, {
        threshold: 0.2, 
        distance: 50,   
      });
      const locationResult = fuseLocation.search(locationWords);
      if (
        locationResult.length > 0 &&
        locationResult[0].score !== undefined &&
        locationResult[0].score < 0.2  
      ) {
        query.location = locationResult[0].item;
      }
    }
 
    const eventQuery = Event.findOne(query); 
    const event = await populateEvent(eventQuery);

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.log('Error at getEventByAI route:', error);
    return null;
  }
}

/// book me a ticket for Museum located in  Bhub