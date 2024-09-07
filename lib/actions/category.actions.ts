"use server"

import { CreateCategoryParams } from "@/types";
import { connectToDatabase } from "../database";
import Category from "../models/category.model";
import TicketFor from "../models/ticketfor.model";
import Event from "../models/event.model";

export async function createCategory({categoryName}: CreateCategoryParams) {
    try {
        await connectToDatabase()

        const newCategory = await Category.create({name : categoryName})
        return JSON.parse(JSON.stringify(newCategory))
    } catch (error) {
        console.log("error in create category route" , error);
    }
}

export async function getAllCategories() {
    try {
        await connectToDatabase()

        const categories = await Category.find()
        return JSON.parse(JSON.stringify(categories))
    } catch (error) {
        console.log("error in get categories route" , error);
    }
}

export async function createTicketFor({categoryName}: CreateCategoryParams) {
    try {
        await connectToDatabase()

        const newCategory = await TicketFor.create({name : categoryName})
        return JSON.parse(JSON.stringify(newCategory))
    } catch (error) {
        console.log("error in create category route" , error);
    }
}

export async function getAllTicket() {
    try {
        await connectToDatabase()

        const categories = await TicketFor.find()
        return JSON.parse(JSON.stringify(categories))
    } catch (error) {
        console.log("error in get categories route" , error);
    }
}
 

// export async function getAllLocation()  {
//     try {
//         await connectToDatabase();

//         const locations: Event[] = await Event.find();
 
//         const uniqueLocations: Location[] = [...new Set(locations?.map((event) => event?.location))];

//         return JSON.parse(JSON.stringify(uniqueLocations));

//     } catch (error) {
//         console.error("Error in get categories route", error);
//         return undefined;
//     }
// }