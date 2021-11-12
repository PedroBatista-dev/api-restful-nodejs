const Hapi = require("@hapi/hapi");

export default class Server {
  public async run() {
    const server = Hapi.server({
      port: 3000,
      host: "localhost",
    });

    server.route({
      method: "GET",
      path: "/{name}",
      handler: (request, h) => {
        return "Hello World!" + request.params.name;
      },
    });

    await server.start();
    console.log("Server running on %s", server.info.uri);
    process.on("unhandledRejection", (err) => {
      console.log(err);
      process.exit(1);
    });
  }
}
