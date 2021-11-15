import * as Hapi from "@hapi/hapi";
import { Server, ServerRoute } from "@hapi/hapi";
import "colors";
import { get } from "node-emoji";
import { initDb } from "./db";
import { Connection } from "typeorm";
import { clientController } from "./controllers";

const init = async () => {
  const server: Server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  const con: Connection = await initDb();

  console.log(get("dvd"), "DB init -> Done!".green, get("dvd"));

  server.route([...clientController(con)] as Array<ServerRoute>);

  await server.start();
  console.log(
    get("rocket"),
    `Server running on ${server.info.uri}`.green,
    get("rocket")
  );
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
