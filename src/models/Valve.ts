import { model, Schema } from "mongoose";

export interface IValve extends Document {
  valve_id: Schema.Types.ObjectId;
  current_position: number;
  status: "pending" | "moving" | "success" | "failed";
  mode: "auto" | "manual";
  updated_at: Date;
}

const valveSchema = new Schema<IValve>({
  valve_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Valve",
  },
  current_position: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "moving", "success", "failed"],
    required: true,
    default: "pending",
  },
  mode: {
    type: String,
    enum: ["auto", "manual"],
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Valve = model<IValve>("Valve", valveSchema)
export default Valve