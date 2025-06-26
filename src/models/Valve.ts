import { model, Schema } from "mongoose";

export interface IValve extends Document {
  deviceId: string;
  deviceType: "VALVE" | "OTHER";
  assignedRTU: number;
  setting: number;
  status: "PENDING" | "MOVING" | "SUCCESS" | "FAILED";
  mode: "AUTO" | "MANUAL";
  updated_at: number;
}

const valveSchema = new Schema<IValve>({
  deviceId: {
    type: String,
    required: true,
    ref: "Valve",
  },
  assignedRTU: {
    type: Number,
    required: true,
  },
  setting: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "MOVING", "SUCCESS", "FAILED"],
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
