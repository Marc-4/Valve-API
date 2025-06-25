import { model, Schema } from "mongoose";

export interface IValve extends Document {
  valve_id: string;
  current_position: number;
  status: "PENDING" | "MOVING" | "success" | "FAILED";
  mode: "AUTO" | "MANUAL";
  updated_at: number;
}

const valveSchema = new Schema<IValve>({
  valve_id: {
    type: String,
    required: true,
    ref: "Valve",
  },
  current_position: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "MOVING", "success", "FAILED"],
    required: true,
    default: "PENDING",
  },
  mode: {
    type: String,
    enum: ["AUTO", "MANUAL"],
  },
  updated_at: {
    type: Number,
    required: true,
    default: Date.now(),
  },
});

const Valve = model<IValve>("Valve", valveSchema);
export default Valve;
