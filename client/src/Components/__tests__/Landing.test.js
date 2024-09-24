// src/Components/Landing.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Landing from "../Landing";
import "@testing-library/jest-dom";

describe("Landing component", () => {
  test("renders title and student boxes", () => {
    render(<Landing />);

    // Check if the title is in the document
    const titleElement = screen.getByText(/Trusted by students at colleges/i);
    expect(titleElement).toBeInTheDocument();

    // Check if student boxes are rendered
    const studentBoxes = screen.getAllByText(
      /Harvard|Stanford|MIT|Yale|MIT ADT|MIT WPU|PICT/i
    );
    expect(studentBoxes.length).toBe(7); // There should be 7 student boxes
  });
});
