import { createServer } from "http";
import app from "./app";
import appEnv from "./configs/envConfig";

const restServer = createServer(app);

const PORT = appEnv.port || 4000;

restServer.listen(PORT, () => {
  console.log(`server listen on ${PORT}`);
});
