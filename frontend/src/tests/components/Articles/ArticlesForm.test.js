import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {
    test("renders correctly", async () => {
        render(
            <Router>
                <ArticlesForm />
            </Router>
        );

        await screen.findByText(/Title/);
        await screen.findByText(/URL/);
        await screen.findByText(/Explanation/);
        await screen.findByText(/Email/);
        await screen.findByText(/Date Added/);
    });

    test("renders correctly when passing in an article", async () => {
        render(
            <Router>
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );

        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });

    test("Correct Error messages on missing input", async () => {
        render(
            <Router>
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required/);
        expect(screen.getByText(/URL is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");

        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(titleField, { target: { value: 'Test Article' } });
        fireEvent.change(urlField, { target: { value: 'https://example.com' } });
        fireEvent.change(explanationField, { target: { value: 'This is a test article' } });
        fireEvent.change(emailField, { target: { value: 'test@example.com' } });
        fireEvent.change(dateAddedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Title is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/URL is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Added is required/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router>
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("URL validation works correctly", async () => {
        render(
            <Router>
                <ArticlesForm />
            </Router>
        );
        
        const urlField = screen.getByTestId("ArticlesForm-url");
        const submitButton = screen.getByTestId("ArticlesForm-submit");
        
        fireEvent.change(urlField, { target: { value: 'not-a-url' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/URL must start with http:\/\/ or https:\/\//);
    });

    test("Email validation works correctly", async () => {
        render(
            <Router>
                <ArticlesForm />
            </Router>
        );
        
        const emailField = screen.getByTestId("ArticlesForm-email");
        const submitButton = screen.getByTestId("ArticlesForm-submit");
        
        fireEvent.change(emailField, { target: { value: 'not-an-email' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/Invalid email address/);
    });
}); 