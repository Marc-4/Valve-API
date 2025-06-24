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
router.patch("/status/:id", (req: Request, res: Response) => {
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

    const valve = Valve.findOneAndUpdate(
      { valve_id: id },
      {
        status,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!valve) {
      return res
        .status(400)
        .json({ status: "ERR", payload: { message: "Invalid status" } });
    }

    return res.status(200).json({ status: "OK", payload: valve });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "ERR", payload: { message: "Internal Server Error" } });
  }
});

//@ts-ignore
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const valve = await Valve.findById(req.params.id);
    if (!valve) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Valve not found" });
    }
    res.status(200).json(1);
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

export default router;
