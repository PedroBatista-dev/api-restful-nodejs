import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import "colors";

export const initDb = async (): Promise<Connection> => {
  const con = await createConnection();
  await con.synchronize(true);
  return con;
};
