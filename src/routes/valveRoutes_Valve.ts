import { Router, Request, Response } from "express";
import Valve from "../models/Valve";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
   
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
