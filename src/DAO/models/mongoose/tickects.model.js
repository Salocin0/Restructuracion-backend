import { Schema, model } from "mongoose";

const schema = new Schema({
    code: { type: String, required: true },
    purchace_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

export const TicketsModel = model('tickets', schema);



