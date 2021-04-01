import { Router } from "express";
import homeController from "./home/home-controller";
import authController from "./auth/auth-controller";

const router = Router();

router.use("/", homeController);
router.use("/", authController);

export default router;
