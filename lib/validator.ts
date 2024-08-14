 
import { z } from "zod"
export const EventFormSchema = z.object({
   title:z.string().min(3,'Title must be at least 3 characters').max(100,'Title must be at most 100 characters'),
    description:z.string().min(10,'Description must be at least 10 characters').max(1000,'Description must be at most 1000 characters'),
    location:z.string().min(3,'Location must be at least 3 characters').max(100,'Location must be at most 100 characters'), 
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url()
  })
  