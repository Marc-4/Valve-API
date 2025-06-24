import { Router, Request, Response } from "express";
import Valve from "../models/Valve";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const valves = await Valve.findOne({ valve_id: id });
    res.status(200).json({
      status: "OK",
      payload: {
        valves,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      payload: {
        message: "Internal Server Error",
      },
    });
  }
});

//@ts-ignore
router.patch("/control/:id", async (req: Request, res: Response) => {
  try {
    const { position } = req.body;
    const { id } = req.params;

    //check position value
    if (position < 0 || position > 90) {
      return res.status(400).json({
        status: "ERR",
        payload: { message: "Position out of bounds" },
      });
    }
    
    //find valve
    const valve = await Valve.findOne({ valve_id: id });
    
    if (!valve) {
      return res.status(404).json({
        status: "ERR",
        payload: { message: "Valve not found" },
      });
    }

    //valve cannot be moved while pending 
    if (valve.status === "pending") {
      return res.status(400).json({
        status: "ERR",
        payload: {
          message: "Cannot send command while valve status is pending",
        },
      });
    }

    valve.updateOne(
      {
        current_position: position,
        status: "pending",
        updated_at: Date.now(),
      },
      { new: true }
    );

    return res.status(200).json({ status: "OK", payload: valve });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "ERR", payload: { message: "Internal Server Error" } });
  }
});

//@ts-ignore
router.patch("/status/:id", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if (
      status !== "pending" ||
      status !== "moving" ||
      status !== "success" ||
      status !== "failed"
    ) {
      return res
        .status(400)
        .json({ status: "ERR", payload: { message: "Invalid status" } });
    }

    const valve = await Valve.findOneAndUpdate(
      { valve_id: id },
      {
        status,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!valve) {
      return res.status(400).json({
        status: "ERR",
        payload: { message: "valve not found or failed to update valve" },
      });
    }

    return res.status(200).json({ status: "OK", payload: valve });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "ERR", payload: { message: "Internal Server Error" } });
  }
});

export default router;
