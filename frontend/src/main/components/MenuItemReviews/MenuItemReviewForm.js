import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function MenuItemReviewForm({
    initialContents,
    submitAction,
    buttonLabel = "Create",
}) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialContents || {} });
    // Stryker restore all

    const navigate = useNavigate();

    const testIdPrefix = "MenuItemReviewForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="itemId">ItemId</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-itemId"}
                    id="itemId"
                    type="long"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("itemId", {
                        required: "ItemId is required.",
                        min: {
                            value: 1,
                            message: "ItemId must be greater than 0.",
                        },
                        max: {
                            value: 1000000,
                            message: "ItemId must be less than 1,000,000.",
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="reviewerEmail">ReviewerEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-reviewerEmail"}
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", {
                        required: "ReviewerEmail is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid={testIdPrefix + "-submit"}>
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
        </Form>
    );
}

export default MenuItemReviewForm;
