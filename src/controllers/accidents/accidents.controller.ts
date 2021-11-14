import { Connection, Repository } from "typeorm";
import { Accidents } from "../../entity/accidents";
import { Clients } from "../../entity/clients";
import { Others } from "../../entity/others";
import { ResponseToolkit, ServerRoute, Request } from "hapi";
import * as Boom from "@hapi/boom";

export const accidentController = (con: Connection): Array<ServerRoute> => {
  const accidentRepo: Repository<Accidents> = con.getRepository(Accidents);
  const clientRepo: Repository<Clients> = con.getRepository(Clients);
  const otherRepo: Repository<Others> = con.getRepository(Others);
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
          data: data.map((u: Accidents) => {
            return u;
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
        const u: Accidents = await accidentRepo.findOne(id);
        if (!u) {
          throw Boom.notFound(`No client available for id »${id}«.`);
        }
        return u;
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
        const client: Clients = await clientRepo.findOne(id);
        if (!client) throw Boom.notFound(`No client available for id »${id}«.`);

        const { car, others } = payload as Partial<Accidents>;

        for (const other of others) {
          const uOther: Others = await otherRepo.findOne({
            where: { cnh: other.cnh },
          });

          if (!uOther) {
            const o: Partial<Others> = new Others(other.cnh, other.name);
            const t: Others = await otherRepo.save<Partial<Others>>(o);
            other.id = t.id;
          } else {
            other.id = uOther.id;
          }
        }

        const a: Accidents = new Accidents(car, client, others);
        return accidentRepo.save<Accidents>(a);
      },
    },
  ];
};
