import moment from "moment";
import dotenv from "dotenv";
import Server from "./src/server/server";

const server = new Server();

moment.locale("es");

dotenv.config();

server.listen();
