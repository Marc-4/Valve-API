import { Router, Request, Response } from "express";
import Valve from "../models/Valve";

const router = Router();

//@ts-ignore
router.get("/", async (req: Request, res: Response) => {
  try {
    const valves = await Valve.find();

    return res.status(200).json({ status: "OK", payload: valves });
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
router.post("/", async (req: Request, res: Response) => {
  try {
    const { valve_id, current_position, status, mode } = req.body;

    if (
      !valve_id ||
      typeof current_position !== "number" ||
      !["PENDING", "MOVING", "SUCCESS", "FAILED"].includes(status) ||
      !["AUTO", "MANUAL"].includes(mode)
    ) {
      return res.status(400).json({
        status: "ERR",
        payload: { message: "Invalid or missing fields" },
      });
    }

    const existing = await Valve.findOne({ valve_id: valve_id });

    if (existing) {
      return res.status(400).json({
        status: "ERR",
        payload: { message: "Valve with valve_id " + valve_id + " exists" },
      });
    }

    const newValve = new Valve({
      valve_id,
      current_position,
      status,
      mode,
      updated_at: Date.now(),
    });

    const savedValve = await newValve.save();

    return res.status(201).json({ status: "OK", payload: savedValve });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      payload: { message: "Internal Server Error" },
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

    //valve cannot be moved while PENDING
    if (valve.status === "PENDING") {
      return res.status(400).json({
        status: "ERR",
        payload: {
          message: "Cannot send command while valve status is PENDING",
        },
      });
    }

    valve.current_position = position;
    valve.status = "PENDING";
    valve.updated_at = Date.now();

    valve.save();

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
      status !== "PENDING" &&
      status !== "MOVING" &&
      status !== "SUCCESS" &&
      status !== "FAILED"
    ) {
      return res
        .status(400)
        .json({ status: "ERR", payload: { message: "Invalid status" } });
    }

    const valve = await Valve.findOne({ valve_id: id });

    if (!valve) {
      return res
        .status(404)
        .json({ status: "ERR", payload: { message: "Valve not found" } });
    }

    if (
      (valve.status === "PENDING" && status != "MOVING") ||
      (valve.status === "MOVING" &&
        (status != "SUCCESS" && status != "FAILED")) ||
      ((valve.status === "SUCCESS" || valve.status === "FAILED") &&
        status != "PENDING")
    ) {
      return res.status(400).json({
        status: "ERR",
        payload: { message: "Status must be sequential" },
      });
    }

    valve.status = status;
    valve.updated_at = Date.now();

    valve.save();

    return res.status(200).json({ status: "OK", payload: valve });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "ERR", payload: { message: "Internal Server Error" } });
  }
});

//@ts-ignore
router.patch("/mode/:id", async (req: Request, res: Response) => {
  try {
    const { mode } = req.body;
    const { id } = req.params;
    if (mode !== "AUTO" && mode !== "MANUAL") {
      return res
        .status(400)
        .json({ status: "ERR", payload: { message: "Invalid mode" } });
    }

    const valve = await Valve.findOne({ valve_id: id });

    if (!valve) {
      return res
        .status(404)
        .json({ status: "ERR", payload: { message: "Valve not found" } });
    }

    valve.mode = mode;
    valve.updated_at = Date.now();

    valve.save();

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
