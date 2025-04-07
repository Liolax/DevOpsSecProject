const request = require("supertest");
const { expect } = require("chai");
const app = require("../server"); // Import the Express app

describe("GET /health", function () {
  this.timeout(5000);
  
  it("should return API health status as OK", async function () {
    const res = await request(app).get("/health");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "OK");
  });
});

describe("Notes API", function () {
  this.timeout(5000);
  
  it("should create, update, and delete a note", async function () {
    // Create a new note
    const noteData = {
      title: "Test Note",
      content: "This is a test note."
    };
    const createRes = await request(app)
      .post("/notes")
      .send(noteData);
      
    expect(createRes.status).to.equal(201);
    expect(createRes.body).to.have.property("id");
    expect(createRes.body.title).to.equal(noteData.title);
    expect(createRes.body.content).to.equal(noteData.content);
    
    const noteId = createRes.body.id;
    
    // Update the note
    const updateData = {
      title: "Updated Test Note",
      content: "This is an updated test note."
    };
    const updateRes = await request(app)
      .put(`/notes/${noteId}`)
      .send(updateData);
      
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.title).to.equal(updateData.title);
    expect(updateRes.body.content).to.equal(updateData.content);
    
    // Delete the note
    const deleteRes = await request(app)
      .delete(`/notes/${noteId}`);
    expect(deleteRes.status).to.equal(200);
    
    // Try fetching the deleted note
    const fetchRes = await request(app)
      .get(`/notes/${noteId}`);
    expect(fetchRes.status).to.equal(404);
    expect(fetchRes.body).to.have.property("message", "Note not found");
  });
});
