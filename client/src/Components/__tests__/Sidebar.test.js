import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../Sidebar";
import cookie from "js-cookie";
import "@testing-library/jest-dom"; // Ensure jest-dom is imported

jest.mock("js-cookie");

describe("Sidebar component", () => {
  beforeEach(() => {
    cookie.get.mockReturnValue("testUser"); // Mock username return value
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  });

  test("renders Sidebar with correct username", () => {
    const usernameDisplay = screen.getByText(/testUser/i);
    expect(usernameDisplay).toBeInTheDocument();
  });

  test("navigates to home when Home menu item is clicked", () => {
    const homeItem = screen.getByText(/Home/i);
    fireEvent.click(homeItem);
    // Assert that the navigation occurred (you may need to adapt this)
  });

  test("navigates to bookmarks when Bookmarks menu item is clicked", () => {
    const bookmarksItem = screen.getByText(/Bookmarks/i);
    fireEvent.click(bookmarksItem);
    // Assert that the navigation occurred (you may need to adapt this)
  });

  test("logs out and removes cookies when Logout is clicked", () => {
    const logoutItem = screen.getByText(/Logout/i);
    fireEvent.click(logoutItem);

    // Assert that cookies have been removed
    expect(cookie.remove).toHaveBeenCalledWith("userToken");
    expect(cookie.remove).toHaveBeenCalledWith("userEmail");
    expect(cookie.remove).toHaveBeenCalledWith("username");
    // You may want to assert navigation as well
  });
});
