import { Connection, Repository } from "typeorm";
import { Client } from "../../entity/client";
import { Other } from "../../entity/other";
import { ResponseToolkit, ServerRoute, Request } from "hapi";
import * as Boom from "@hapi/boom";
import * as Joi from "@hapi/joi";

export const clientController = (con: Connection): Array<ServerRoute> => {
  const clientRepo: Repository<Client> = con.getRepository(Client);
  const otherRepo: Repository<Other> = con.getRepository(Other);
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
          data: data.map((clients: Client) => {
            return clients;
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
        const client: Client = await clientRepo.findOne(id);
        if (!client) {
          throw Boom.notFound(`No client available for id »${id}«.`);
        }
        return client;
      },
    },
    {
      method: "POST",
      path: "/clients",
      handler: async (
        { payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const { cnh, name } = payload as Partial<Client>;

        const dataClient: Client = await clientRepo.findOne({
          where: { cnh: cnh },
        });
        if (dataClient) throw Boom.notAcceptable(`Client already registered.`);

        const dataOther: Other = await otherRepo.findOne({
          where: { cnh: cnh },
        });

        if (dataOther) {
          const p: Partial<Client> = new Client(dataOther.cnh, dataOther.name);
          return clientRepo.save<Partial<Client>>(p);
        } else {
          const p: Partial<Client> = new Client(cnh, name);
          return clientRepo.save<Partial<Client>>(p);
        }
      },
      options: {
        validate: {
          payload: Joi.object({
            cnh: Joi.string()
              .required()
              .length(11)
              .pattern(/^[0-9]+$/),
            name: Joi.string().required().max(250).min(3),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
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
        const dataClient: Client = await clientRepo.findOne(id);
        if (!dataClient)
          throw Boom.notFound(`No client available for id »${id}«.`);

        Object.keys(payload).forEach((key) => (dataClient[key] = payload[key]));
        clientRepo.update(id, dataClient);
        return dataClient;
      },
      options: {
        validate: {
          payload: Joi.object({
            id: Joi.number().required(),
            cnh: Joi.string()
              .required()
              .length(11)
              .pattern(/^[0-9]+$/),
            name: Joi.string().required().max(250).min(3),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
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
        const dataClient = await clientRepo.findOne(id);
        if (!dataClient) {
          throw Boom.notFound(`No client available for id »${id}«.`);
        }
        clientRepo.remove(dataClient);
        return dataClient;
      },
    },
  ];
};
