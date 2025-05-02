import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";

// Mock the navigate function
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesTable tests", () => {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient();
  const testId = "ArticlesTable";

  test("Renders expected column headers and content for regular user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Expected headers and fields
    const expectedHeaders = [
      "id",
      "Title",
      "Url",
      "Explanation",
      "Email",
      "Date Added",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];

    // Verify headers are present
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    // Verify fields are present
    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
    });

    // Check specific content
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    // Verify buttons are not present for regular user
    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Displays expected column headers and content with admin buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Expected headers and fields
    const expectedHeaders = [
      "id",
      "Title",
      "Url",
      "Explanation",
      "Email",
      "Date Added",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];

    // Verify headers are present
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    // Verify fields are present
    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
    });

    // Check specific content
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    // Verify admin buttons are present
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the correct edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the table to render
    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    // Find and click the edit button
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    // Verify navigation occurred correctly
    await waitFor(() => 
      expect(mockedNavigate).toHaveBeenCalledWith("/articles/edit/1")
    );
  });

  test("Delete button triggers API call with correct parameters", async () => {
    // Set up admin user and mock API
    const currentUser = currentUserFixtures.adminUser;
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/articles")
      .reply(200, { message: "Article deleted" });

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the table to render
    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    // Find and click the delete button
    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    // Verify the API call was made with correct parameters
    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});