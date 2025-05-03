import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBOrganizationForm({
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

  const testIdPrefix = "UCSBOrganizationForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {!initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="orgCode">OrgCode</Form.Label>
          <Form.Control
            id="orgCode"
            type="text"
            isInvalid={Boolean(errors.orgCode)}
            {...register("orgCode", {
              required: "OrgCode is required.",
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.orgCode?.message}
          </Form.Control.Feedback>
        </Form.Group>
      )}

      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="orgCode">OrgCode</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-orgCode"}
            id="orgCode"
            type="text"
            {...register("orgCode")}
            value={initialContents.orgCode}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslationShort">
          OrgTranslationShort
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslationShort"}
          id="orgTranslationShort"
          type="text"
          isInvalid={Boolean(errors.orgTranslationShort)}
          {...register("orgTranslationShort", {
            required: "OrgTranslationShort is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslationShort?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslation">OrgTranslation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslation"}
          id="orgTranslation"
          type="text"
          isInvalid={Boolean(errors.orgTranslation)}
          {...register("orgTranslation", {
            required: "OrgTranslation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="inactive">Inactive</Form.Label>
        <Form.Select
          data-testid={testIdPrefix + "-inactive"}
          id="inactive"
          isInvalid={Boolean(errors.inactive)}
          {...register("inactive", {
            validate: (value) => value !== "invalid" || "Inactive is required.",
          })}
        >
          <option value="invalid">--</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.inactive?.message}
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

export default UCSBOrganizationForm;
