import { Connection, Repository } from "typeorm";
import { Accident } from "../../entity/accident";
import { Client } from "../../entity/client";
import { Other } from "../../entity/other";
import { ResponseToolkit, ServerRoute, Request } from "hapi";
import * as Boom from "@hapi/boom";

export const accidentController = (con: Connection): Array<ServerRoute> => {
  const accidentRepo: Repository<Accident> = con.getRepository(Accident);
  const clientRepo: Repository<Client> = con.getRepository(Client);
  const otherRepo: Repository<Other> = con.getRepository(Other);
  return [
    {
      method: "GET",
      path: "/accidents",
      handler: async ({ query }: Request, h: ResponseToolkit, err?: Error) => {
        let { perPage, page, ...q } = query;
        let realPage: number;
        let realTake: number;
        if (perPage) realTake = +perPage;
        else {
          perPage = "10";
          realTake = 10;
        }
        if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake;
        else {
          realPage = 0;
          page = "1";
        }
        const findOptions = {
          take: realTake,
          skip: realPage,
          where: { ...q },
        };
        if (!q) delete findOptions.where;
        const getQuery = () =>
          Object.keys(q)
            .map((key) => `${key}=${q[key]}`)
            .join("&");
        const qp: string = getQuery().length === 0 ? "" : `&${getQuery()}`;
        const data = await accidentRepo.find(findOptions);
        return {
          data: data.map((dataAccidents: Accident) => {
            return dataAccidents;
          }),
          perPage: realTake,
          page: +page || 1,
          next: `http://localhost:3000/accidents?perPage=${realTake}&page=${
            +page + 1
          }${qp}`,
          prev: `http://localhost:3000/accidents?perPage=${realTake}&page=${
            +page - 1
          }${qp}`,
        };
      },
    },
    {
      method: "GET",
      path: "/accidents/{id}",
      async handler(
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) {
        const dataAccident: Accident = await accidentRepo.findOne(id);
        if (!dataAccident) {
          throw Boom.notFound(`No client available for id »${id}«.`);
        }
        return dataAccident;
      },
    },
    {
      method: "POST",
      path: "/clients/{id}/accidents",
      handler: async (
        { params: { id }, payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const dataClient: Client = await clientRepo.findOne(id);
        if (!dataClient)
          throw Boom.notFound(`No client available for id »${id}«.`);

        const { car, others } = payload as Partial<Accident>;

        for (const other of others) {
          const dataOther: Other = await otherRepo.findOne({
            where: { cnh: other.cnh },
          });

          if (!dataOther) {
            const o: Partial<Other> = new Other(other.cnh, other.name);
            const newOther: Other = await otherRepo.save<Partial<Other>>(o);
            other.id = newOther.id;
          } else {
            other.id = dataOther.id;
          }
        }

        const dataAccident: Accident = new Accident(car, dataClient, others);
        return accidentRepo.save<Accident>(dataAccident);
      },
    },
  ];
};
