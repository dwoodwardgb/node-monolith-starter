import { Router } from "express";
import { renderHtml } from "../web/html";
import homeView from "./home-view";

const router = Router();

router.get("/", (_, res) => {
  res.send(renderHtml(homeView()));
});

export default router;
