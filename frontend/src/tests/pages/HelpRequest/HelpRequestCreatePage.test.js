import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {
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
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"), // ?
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 17,
      requesterEmail: "test@ucsb.edu",
      teamID: "07",
      tableOrBreakoutRoom: "07",
      explanation: "creating pages not working",
      solved: false,
      localDateTime: "2022-02-02T00:00",
    };

    axiosMock.onPost("/api/helprequest/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const teamIDField = screen.getByTestId("HelpRequestForm-teamID");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const localDateTimeField = screen.getByTestId(
      "HelpRequestForm-localDateTime",
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "test@ucsb.edu" },
    });
    fireEvent.change(teamIDField, { target: { value: "07" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "07" } });
    fireEvent.change(explanationField, {
      target: { value: "creating pages not working" },
    });
    fireEvent.change(solvedField, { target: { value: "true" } });
    fireEvent.change(localDateTimeField, {
      target: { value: "2022-02-02T00:00" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      localDateTime: "2022-02-02T00:00",
      requesterEmail: "test@ucsb.edu",
      teamID: "07",
      tableOrBreakoutRoom: "07",
      explanation: "creating pages not working",
      solved: false,
    });

    expect(mockToast).toBeCalledWith(
      "New helpRequest Created - id: 17 email: test@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
