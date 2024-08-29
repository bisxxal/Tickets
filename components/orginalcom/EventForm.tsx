"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
  
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EventFormSchema } from "@/lib/validator"
import { eventDefaultValues } from "../constant"
import DropDown from "./DropDown"
import { Textarea } from "../ui/textarea" 
import { FileUploader } from "./FileUploder"
import { useState } from "react"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { Checkbox } from "../ui/checkbox"
import { useUploadThing } from "@/lib/uploadthing" 
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { Calendar, Category, Link1, Location } from 'iconsax-react';
import { IEvent } from "@/lib/models/event.model"
import TicketForDropDown from "./TicketForDropDown"
type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent
  eventId?: string
}
function EventForm({ userId, type ,event , eventId}:EventFormProps) {
  const [files , setFiles] = useState<File[]>([])
  const router = useRouter()
  const intitialValues = event && type=== 'Update' ? {...event ,  startDateTime: new Date(event.startDateTime), 
    endDateTime: new Date(event.endDateTime) } : eventDefaultValues;


  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues:intitialValues
  })

  const {startUpload} = useUploadThing("imageUploader")
  
  async function onSubmit(values: z.infer<typeof EventFormSchema>) { 
 
    
    let uploadedImageUrl = values.imageUrl;

    if(files.length > 0) {
      const uploadedImages = await startUpload(files)

      if(!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    } 

     if(type === "Create"){
        try {
          const newEvent = await createEvent({
            event: { ...values, imageUrl: uploadedImageUrl },
            userId,
            path: '/profile'
          })
  
          if(newEvent) {
            form.reset();
            router.push(`/events/${newEvent._id}`)
          }

          // console.log("create event", values); ;
          
 
          
        } catch (error) {
          
        } 
     }

    if(type === 'Update') {

      if(!eventId) {
        router.back()
        return;
      }
      try {
        const UpdateEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl , _id: eventId },
          path: `/events/${eventId}`
        })

        if(UpdateEvent) {
          form.reset();
          router.push(`/events/${UpdateEvent._id}`)
        }

        
      } catch (error) {
        // console.log(error);
        
      } 
     }

    }
   
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex overflow-hidden flex-col gap-3">
      <div className=" flex max-lg:flex-col gap-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className=" w-full rounded-xl bg-[#0d0f14]  ">
            
            <FormControl>
              <Input className=" placeholder:text-zinc-400 border-none" placeholder="Event Title" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className=" w-[290px] max-lg:w-full  flex items-center bg-[#0d0f14] gap-1 px-3 rounded-xl">
            <Category color="#d9e3f0" variant="TwoTone"/>
            <FormControl className=" border-none " >
            <DropDown onChangeHandeler={field.onChange} value={field.value} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
     
      </div>

      <div className=" bg-blac w-full ">

         <FormField
        control={form.control}
        name="TicketFor"
        render={({ field }) => (
          <FormItem className=" w-[290px] max-lg:w-full  flex items-center bg-[#0d0f14] gap-1 px-3 rounded-xl"> 
            <FormControl className=" border-none " >
            <TicketForDropDown onChangeHandeler={field.onChange} value={field.value} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      </div>

      <div className=" flex flex-col gap-5 max-lg:flex-col">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className=" w-full bg-[#0d0f14] rounded-xl  ">
                
                <FormControl>
                <Textarea className="placeholder:text-zinc-400 " placeholder="description" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className=" w-full bg-[#0d0f14] ">
                
                <FormControl  > 
                <FileUploader onFieldChange={(url: string) => field.onChange(url)} setFiles={setFiles} imageUrl={field.value} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />
      </div>

      <div >
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className=" w-full flex items-center bg-[#0d0f14] gap-1 px-3 rounded-xl">
            
            <Location color="#d9e3f0" variant="TwoTone"/>
            <FormControl>
              
              <Input className="placeholder:text-zinc-400  border-none " placeholder="Event Location " {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      </div>


      <div className=" flex justify-center items-center gap-5 max-lg:flex-col">
 
            <FormItem className="w-full  bg-[#0d0f14] flex items-center  px-5 rounded-xl ">
        <p>Starting Date: </p>
         
        <FormControl className="   text-black ">
          <Controller
            name="startDateTime" 
            control={form.control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                selected={value }
                onChange={(date) => onChange(date)} 
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                wrapperClassName="datePicker"
                className=" bg-transparent pb-4 px-5 py-3 placeholder:text-zinc-400  "
              />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>


            <FormItem className="w-full   bg-[#0d0f14] flex items-center  px-5 rounded-xl ">
        <p>Ending Date: </p>
        <FormControl className="  text-black ">
          <Controller
            name="endDateTime" 
            control={form.control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                selected={value }
                onChange={(date) => onChange(date)}
              
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                wrapperClassName="datePicker"
                className=" bg-transparent pb-4 px-5 py-3 placeholder:text-zinc-400 "
              />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      </div>

      <div className="flex items-center justify-center max-lg:flex-col gap-5 ">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex items-center h-[54px] w-full overflow-hidden rounded-xl bg-[#0d0f14]  px-4 py-2">
                     
                      <Input type="number" placeholder="Price ₹" {...field} className="placeholder:text-zinc-400  border-0 bg-transparent outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                  
                      <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <label htmlFor="isFree" className=" text-sm whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
                                <Checkbox
                                  onCheckedChange={field.onChange}
                                  checked={field.value}
                                id="isFree" className="mr-2 h-5 w-5 border-2 rounded " />
                              </div>
          
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />   
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />   
           <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full flex bg-[#0d0f14] items-center justify-center px-2 rounded-xl">
                  <Link1 color="#d9e3f0" variant="TwoTone"/>
                  <FormControl>
                    <div className="flex items-center pb-2 w-full overflow-hidden px-1  ">
                      <Input placeholder="URL" {...field} className=" text-blue-500  border-none outline-none  " />
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>


        <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className=" bg-blue-600 rounded-xl mt-7 hover:bg-pink-600 col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            'Submitting...'
          ): `${type} Event `}</Button>
    </form>
  </Form>
  )
}

export default EventForm