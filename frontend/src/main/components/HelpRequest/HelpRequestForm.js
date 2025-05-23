import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function HelpRequestForm({
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

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="HelpRequestForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="localDateTime">Date (iso format)</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-localDateTime"
              id="localDateTime"
              type="datetime-local"
              isInvalid={Boolean(errors.localDateTime)}
              {...register("localDateTime", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.localDateTime && "LocalDateTime is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Email</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-requesterEmail"
              id="requesterEmail"
              type="text"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: "Email is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesterEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teamID">Team ID</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-teamID"
              id="teamID"
              type="text"
              isInvalid={Boolean(errors.teamID)}
              {...register("teamID", {
                required: "Team ID is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamID?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="tableOrBreakoutRoom">
              Table or Breakout Room Number
            </Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-tableOrBreakoutRoom"
              id="tableOrBreakoutRoom"
              type="text"
              isInvalid={Boolean(errors.tableOrBreakoutRoom)}
              {...register("tableOrBreakoutRoom", {
                required: "Table or breakout room number is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tableOrBreakoutRoom?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-explanation"
              id="explanation"
              type="text"
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: "Explanation is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          {/* <Form.Group className="mb-3">
            <Form.Label htmlFor="solved">Solved (true/false)</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-solved"
              id="solved"
              type="text"
              isInvalid={Boolean(errors.solved)}
              {...register("solved", {
                required: "Solved status is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.solved?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="solved">Solved (check for solved)</Form.Label>
            <Form.Check
              type="checkbox"
              id="solved"
              data-testid="HelpRequestForm-solved"
              {...register("solved")}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="HelpRequestForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="HelpRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default HelpRequestForm;
