process.env.ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

let expect = chai.expect;

chai.use(chaiHttp);
describe("Testing the users 1", () => {
  describe("Delete All Users", () => {
    it("it should delete all the users", (done) => {
      chai
        .request(server)
        .delete("/api/v1/users/")
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });
  });

  describe("Register A User", () => {
    it("it should register a new user", (done) => {
      let chaiRequest = chai
        .request(server)
        .post("/api/v1/users/register")
        .send({
          name: "Hebron Praise",
          email: "panampraisehebron@gmail.com",
          password: "panampraise",
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal("success");
          expect(res.body.data.user.id.length).to.above(16);
          expect(res.body.token.length).to.above(16);
          done();
        });
    });
  });

  describe("Login A User", () => {
    it("it should login a user", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({
          email: "panampraisehebron@gmail.com",
          password: "panampraise",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal("success");
          expect(res.body.data.user.balance).to.above(0);
          done();
        });
    });
  });
});




