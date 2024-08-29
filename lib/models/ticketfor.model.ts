import { Document, Schema, model, models } from "mongoose";

export interface ITicketFor extends Document {
  _id: string;
  name: string;
}

const TicketForSchema = new Schema({
  name: { type: String, required: true },
})

const TicketFor = models.TicketFor || model('TicketFor', TicketForSchema);

export default TicketFor;