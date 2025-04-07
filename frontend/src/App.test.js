import React from "react"; // To satisfy ESLint
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// A mock array of notes to simulate data coming from the API
const mockNotes = [
  {
    _id: "1",
    title: "Test Note 1",
    content: "Content 1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Another Note",
    content: "Content 2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Before each test, mock the global fetch to return the mockNotes by default
beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => mockNotes,
  });
});

// After each test, restore the original fetch implementation
afterEach(() => {
  global.fetch.mockRestore();
});

test("renders the main heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/private diary/i);
  expect(headingElement).toBeInTheDocument();
});

test("displays notes when fetch returns data", async () => {
  render(<App />);
  // Wait until at least one note title is rendered
  const noteTitleElement = await waitFor(() =>
    screen.getByText(mockNotes[0].title)
  );
  expect(noteTitleElement).toBeInTheDocument();
});

test("displays 'No notes found.' when no notes are returned", async () => {
  // Override the fetch mock for this test to return an empty array
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });
  
  render(<App />);
  // Wait until the "No notes found." message appears
  const messageElement = await waitFor(() =>
    screen.getByText(/no notes found/i)
  );
  expect(messageElement).toBeInTheDocument();
});
