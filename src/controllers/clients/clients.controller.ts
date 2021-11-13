import { Connection, Repository } from "typeorm";
import { Clients } from "../../entity/clients";
import { ResponseToolkit, ServerRoute, Request } from "hapi";

export const clientController = (con: Connection): Array<ServerRoute> => {
  const clientRepo: Repository<Clients> = con.getRepository(Clients);
  return [
    {
      method: "GET",
      path: "/clients",
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
        const data = await clientRepo.find(findOptions);
        return {
          data: data.map((u: Clients) => {
            return u;
          }),
          perPage: realTake,
          page: +page || 1,
          next: `http://localhost:3000/clients?perPage=${realTake}&page=${
            +page + 1
          }${qp}`,
          prev: `http://localhost:3000/clients?perPage=${realTake}&page=${
            +page - 1
          }${qp}`,
        };
      },
    },
    {
      method: "GET",
      path: "/clients/{id}",
      async handler(
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) {
        const u: Clients = await clientRepo.findOne(id);
        return u;
      },
    },
    {
      method: "POST",
      path: "/clients",
      handler: ({ payload }: Request, h: ResponseToolkit, err?: Error) => {
        const { cnh, name } = payload as Partial<Clients>;
        const p: Partial<Clients> = new Clients(cnh, name);
        return clientRepo.save<Partial<Clients>>(p);
      },
    },
    {
      method: "PATCH",
      path: "/clients/{id}",
      handler: async (
        { params: { id }, payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const u = await clientRepo.findOne(id);
        Object.keys(payload).forEach((key) => (u[key] = payload[key]));
        clientRepo.update(id, u);
        return u;
      },
    },
    {
      method: "DELETE",
      path: "/clients/{id}",
      handler: async (
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const u = await clientRepo.findOne(id);
        clientRepo.remove(u);
        return u;
      },
    },
  ];
};
