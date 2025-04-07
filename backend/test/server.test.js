const request = require("supertest");
const { expect } = require("chai");
const app = require("../server"); // Import the Express app

describe("GET /health", () => {
  it("should return API health status as OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "OK");
  });
});
