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

describe("Notes API", () => {
  let createdNoteId; // To store the note ID created in the test

  it("should create a new note", async () => {
    const noteData = {
      title: "Test Note",
      content: "This is a test note."
    };
    const res = await request(app)
      .post("/notes")
      .send(noteData);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.title).to.equal(noteData.title);
    expect(res.body.content).to.equal(noteData.content);
    
    // Save the created note ID for possible further testing
    createdNoteId = res.body.id;
  });

  it("should delete a note and return 404 when fetching it afterwards", async () => {
    // First, create a temporary note to delete
    const noteData = {
      title: "Temporary Note",
      content: "This note will be deleted."
    };
    const createRes = await request(app)
      .post("/notes")
      .send(noteData);
    expect(createRes.status).to.equal(201);
    const noteId = createRes.body.id;
    
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
