import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroSection from "../HeroSection";

describe("HeroSection component", () => {
  test("renders without crashing", () => {
    render(<HeroSection />);
    // Check if the main container is in the document
    const heroSectionElement = screen.getByText(
      /Anonymously Share College Experiences and Reviews/i
    );
    expect(heroSectionElement).toBeInTheDocument();
  });

  test("displays the correct heading", () => {
    render(<HeroSection />);
    const headingElement = screen.getByRole("heading", {
      name: /Anonymously Share College Experiences and Reviews/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  test("displays the correct subheading", () => {
    render(<HeroSection />);
    const subheadingElement = screen.getByText(
      /Join our community to access genuine college insights, engage in discussions, and make informed decisions./i
    );
    expect(subheadingElement).toBeInTheDocument();
  });

  test("displays the correct button text", () => {
    render(<HeroSection />);
    const buttonElement = screen.getByRole("link", { name: /Join Now/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
