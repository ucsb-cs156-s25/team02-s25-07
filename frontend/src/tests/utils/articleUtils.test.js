import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/articleUtils";
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

describe("ArticleUtils functions", () => {
  describe("onDeleteSuccess function", () => {
    test("Logs message to console and displays toast notification", () => {
      // Set up console mock
      const restoreConsole = mockConsole();

      // Test message
      const testMessage = "Article successfully deleted";

      // Call the function
      onDeleteSuccess(testMessage);

      // Verify toast was called with the message
      expect(mockToast).toHaveBeenCalledWith(testMessage);

      // Verify console.log was called
      expect(console.log).toHaveBeenCalled();

      // Verify the console message contains our test message
      const loggedMessage = console.log.mock.calls[0][0];
      expect(loggedMessage).toContain(testMessage);

      // Restore console
      restoreConsole();
    });
  });
  describe("cellToAxiosParamsDelete", () => {
    test("Returns correct axios parameters object", () => {
      // Sample cell data with ID
      const testId = 42;
      const cell = {
        row: {
          values: { id: testId },
        },
      };

      // Call the function
      const result = cellToAxiosParamsDelete(cell);

      // Verify the returned object structure
      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: { id: testId },
      });
    });
  });
});
