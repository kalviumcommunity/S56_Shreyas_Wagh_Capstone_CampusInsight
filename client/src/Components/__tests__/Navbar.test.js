import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Navbar from "../Navbar"; // Adjust the import path if necessary
import "@testing-library/jest-dom";

describe("Navbar component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap Navbar with MemoryRouter */}
        <Navbar />
      </MemoryRouter>
    );
  });

  test("renders Navbar with correct title", () => {
    const logoText = screen.getByText(/AnonymX/i); // Hidden logo text
    expect(logoText).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    const homeLink = screen.getByText(/Home/i);
    const aboutLink = screen.getByText(/About/i);
    const featuresLink = screen.getByText(/Features/i);
    const blogLink = screen.getByText(/Blog/i);
    const contactLink = screen.getByText(/Contact/i);

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(featuresLink).toBeInTheDocument();
    expect(blogLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  test("dropdown opens and displays login and signup options", () => {
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);

    const loginLink = screen.getByText(/Login/i);
    const signupLink = screen.getByText(/Signup/i);

    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });

  test("dropdown closes when clicking the button again", () => {
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton); // Open dropdown
    fireEvent.click(getStartedButton); // Close dropdown

    const loginLink = screen.queryByText(/Login/i);
    const signupLink = screen.queryByText(/Signup/i);

    expect(loginLink).not.toBeInTheDocument();
    expect(signupLink).not.toBeInTheDocument();
  });
});
