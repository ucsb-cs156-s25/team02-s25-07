import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "yuchenliu735@ucsb.edu",
          professorEmail: "phtcon@ucsb.edu",
          explanation: "Recommendation letter from Prof. Conrad for Steven Liu",
          dateRequested: "2025-04-28T11:17:36",
          dateNeeded: "2025-05-28T23:59:59",
          done: true,
        });
      axiosMock.onPut("/api/recommendationrequest").reply(200, {
        id: 17,
        requesterEmail: "yuchenliu735@ucsb.edu",
        professorEmail: "phtcon@ucsb.edu",
        explanation: "Recommendation letter from Prof. Conrad for Steven Liu",
        dateRequested: "2025-04-28T11:17:36",
        dateNeeded: "2025-05-28T23:59:59",
        done: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterField = screen.getByLabelText("Requester Email");
      const professorField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (iso format)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (iso format)");
      const doneField = screen.getByLabelText(
        "Done? (if checked the recommendation is done; else it is not done.)",
      );
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterField).toBeInTheDocument();
      expect(requesterField).toHaveValue("yuchenliu735@ucsb.edu");
      expect(professorField).toBeInTheDocument();
      expect(professorField).toHaveValue("phtcon@ucsb.edu");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "Recommendation letter from Prof. Conrad for Steven Liu",
      );
      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2025-04-28T11:17:36.000");
      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2025-05-28T23:59:59.000");
      expect(doneField).toBeInTheDocument();
      expect(doneField).toBeChecked("true");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterField, {
        target: { value: "yuchenliu735@ucsb.edu" },
      });
      fireEvent.change(professorField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: {
          value: "Recommendation letter from Prof. Conrad for Steven Liu",
        },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-04-28T11:17:36" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-05-28T23:59:59" },
      });
      fireEvent.change(doneField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "yuchenliu735@ucsb.edu",
          professorEmail: "phtcon@ucsb.edu",
          explanation: "Recommendation letter from Prof. Conrad for Steven Liu",
          dateRequested: "2025-04-28T11:17:36.000",
          dateNeeded: "2025-05-28T23:59:59.000",
          done: true,
        }),
      ); // posted object
    });
  });
});
