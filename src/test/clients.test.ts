import * as request from "supertest";

const baseUrl = "http://localhost:3000";

const client = {
  id: undefined,
  cnh: "12345678910",
  name: "Test Jest",
};

describe("Test CRUD of Client", () => {
  it("Post Client", (done) => {
    request(baseUrl)
      .post("/clients")
      .send(client)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        client.id = res.body.id;
        return done();
      });
  });

  it("Update Client", (done) => {
    console.log(client);
    client.name = "Test Update";
    request(baseUrl)
      .patch("/clients/" + client.id)
      .send(client)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });

  it("Get Client", (done) => {
    request(baseUrl)
      .get("/clients")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.data[0].id).toEqual(client.id);
        expect(res.body.data[0].cnh).toEqual(client.cnh);
        expect(res.body.data[0].name).toEqual(client.name);
        return done();
      });
  });

  it("Delete Client", (done) => {
    request(baseUrl)
      .delete("/clients/" + client.id)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
