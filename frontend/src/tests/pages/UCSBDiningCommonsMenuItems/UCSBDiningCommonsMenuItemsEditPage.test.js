import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

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

describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {
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
      axiosMock.onGet("/api/menuitems", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Item");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
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
      axiosMock.onGet("/api/menuitems", { params: { id: 17 } }).reply(200, {
        id: 17,
        diningCommonsCode: "Portola",
        name: "California Roll",
        station: "International",
      });
      axiosMock.onPut("/api/menuitems").reply(200, {
        id: "17",
        diningCommonsCode: "dAnswer",
        name: "nAnswer",
        station: "sAnswer",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByLabelText("diningCommonsCode");
      const nameField = screen.getByLabelText("name");
      const stationField = screen.getByLabelText("station");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toBeInTheDocument();
      expect(diningCommonsCodeField).toHaveValue("Portola");
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("California Roll");
      expect(stationField).toBeInTheDocument();
      expect(stationField).toHaveValue("International");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(diningCommonsCodeField, {
        target: { value: "dAnswer" },
      });
      fireEvent.change(nameField, {
        target: { value: "nAnswer" },
      });
      fireEvent.change(stationField, {
        target: { value: "sAnswer" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Item Updated - id: 17 name: nAnswer",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItem" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "dAnswer",
          name: "nAnswer",
          station: "sAnswer",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItem" });
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <UCSBDiningCommonsMenuItemsEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

    //   const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
    //   const diningCommonsCodeField = screen.getByLabelText("diningCommonsCode");
    //   const nameField = screen.getByLabelText("name");
    //   const stationField = screen.getByLabelText("station");
    //   const submitButton = screen.getByText("Update");

    //   expect(idField).toBeInTheDocument();
    //   expect(idField).toHaveValue("17");
    //   expect(diningCommonsCodeField).toBeInTheDocument();
    //   expect(diningCommonsCodeField).toHaveValue("Portola");
    //   expect(nameField).toBeInTheDocument();
    //   expect(nameField).toHaveValue("California Roll");
    //   expect(stationField).toBeInTheDocument();
    //   expect(stationField).toHaveValue("International");

    //   expect(submitButton).toHaveTextContent("Update");

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toHaveBeenCalled());
    //   expect(mockToast).toHaveBeenCalledWith(
    //     "Restaurant Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItem" });
    // });
  });
});
