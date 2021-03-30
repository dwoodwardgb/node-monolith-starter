import { Router } from "express";
import homeController from "./home/home-controller";

const router = Router();

router.use("/", homeController);

export default router;
