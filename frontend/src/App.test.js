import React from "react"; // To satisfy ESLint
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the main heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/private diary/i);
  expect(headingElement).toBeInTheDocument();
});
