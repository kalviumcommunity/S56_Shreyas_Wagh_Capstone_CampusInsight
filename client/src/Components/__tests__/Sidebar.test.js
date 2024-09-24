import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";
import cookie from "js-cookie";
import "@testing-library/jest-dom";

jest.mock("js-cookie");

describe("Sidebar component", () => {
  beforeEach(() => {
    cookie.get.mockReturnValue("testUser"); 
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Sidebar />} />
          <Route path="/home" element={<div>Home Page</div>} />
          <Route path="/bookmarks" element={<div>Bookmarks Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
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

    expect(screen.getByText(/Home Page/i)).toBeInTheDocument(); // Check if Home Page is rendered
  });

   test("navigates to bookmarks when Bookmarks menu item is clicked", () => {
     const bookmarksItem = screen.getByText(/Bookmarks/i);
     fireEvent.click(bookmarksItem);

     expect(screen.getByText(/Bookmarks Page/i)).toBeInTheDocument(); // Check if Bookmarks Page is rendered
   });

  test("logs out and removes cookies when Logout is clicked", () => {
    const logoutItem = screen.getByText(/Logout/i);
    fireEvent.click(logoutItem);

    // Assert that cookies have been removed
    expect(cookie.remove).toHaveBeenCalledWith("userToken");
    expect(cookie.remove).toHaveBeenCalledWith("userEmail");
    expect(cookie.remove).toHaveBeenCalledWith("username");

    // Ensuring the username is no longer displayed
    expect(screen.queryByText(/testUser/i)).not.toBeInTheDocument();

    expect(screen.getByText(/Explore/i)).toBeInTheDocument();
  });
});
