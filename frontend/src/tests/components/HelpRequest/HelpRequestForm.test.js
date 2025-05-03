import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  const expectedHeaders = [
    "Date (iso format)",
    "Email",
    "Team ID",
    "Table or Breakout Room Number",
    "Explanation",
    "Solved (check for solved)",
  ];
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
      </Router>,
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-localDateTime");
    const localDateTimeField = screen.getByTestId(
      "HelpRequestForm-localDateTime",
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(localDateTimeField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    // await screen.findByText(/localDateTime must be in ISO format/);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Team ID is required./);
    expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or breakout room number is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    // expect(screen.getByText(/Solved status is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-teamID");

    const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
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

    fireEvent.change(emailField, { target: { value: "test@ucsb.edu" } });
    fireEvent.change(teamIDField, { target: { value: "7" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "8" } });
    fireEvent.change(explanationField, { target: { value: "aaaaaaa" } });
    fireEvent.change(solvedField, { target: { value: true } });
    fireEvent.change(localDateTimeField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // expect(
    //   screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/),
    // ).not.toBeInTheDocument();
    // expect(
    //   screen.queryByText(/localDateTime must be in ISO format/),
    // ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
