import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RestaurantCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Comments")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const oneMIR = {
      id: 14,
      itemId: 100,
      reviewerEmail: "fernandoA@ucsb.edu",
      stars: 5,
      comments: "Fantastic authentic hispanic food!",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, oneMIR);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Stars")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("ItemId");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("ReviewerEmail");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("Comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: 100 } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "fernandoA@ucsb.edu" },
    });
    fireEvent.change(starsInput, { target: { value: 5 } });
    fireEvent.change(commentsInput, {
      target: { value: "Fantastic authentic hispanic food!" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "100",
      reviewerEmail: "fernandoA@ucsb.edu",
      stars: "5",
      comments: "Fantastic authentic hispanic food!",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New MenuItemReview Created - id: 14 reviewerEmail: fernandoA@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });
  });
});
