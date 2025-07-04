import express from "express";
import { logger } from "./middlewares/logger";
import router from "./routes/router";

const app = express();

app.use(logger);
app.use("/api/v1", router);

export default app;
