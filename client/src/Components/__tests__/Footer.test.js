import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Correct import for jest-dom
import Footer from "../Footer";

describe("Footer component", () => {
  test("renders Footer with correct text content", () => {
    render(<Footer />);
    const briefElement = screen.getByText(
      /Anonymously share college experiences/i
    );
    expect(briefElement).toBeInTheDocument();

    const emailElement = screen.getByText("AnonymS@gmail.com");
    expect(emailElement).toBeInTheDocument();
  });

  test("renders Footer navigation links", () => {
    render(<Footer />);
    const termsLink = screen.getByText(/Terms/i);
    const privacyLink = screen.getByText(/Privacy/i);
    const complianceLink = screen.getByText(/Compliance/i);
    const contactLink = screen.getByText(/Contact/i);

    expect(termsLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(complianceLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  test("MountainIcon renders correctly", () => {
    render(<Footer />);
    const svgElement = screen.getByTestId("mountain-icon");
    expect(svgElement).toBeInTheDocument();
  });
});
