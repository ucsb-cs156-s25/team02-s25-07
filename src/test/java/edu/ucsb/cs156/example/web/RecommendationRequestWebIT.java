package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {

    @Autowired
        RecommendationRequestRepository recommendationRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_recommendationRequest() throws Exception {

        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

        String requesteremail1 = "yuchenliu735@ucsb.edu";

        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                //.id(1L)
                .requesterEmail(requesteremail1)
                .professorEmail("pconrad@ucsb.edu")
                .explanation("testing")
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .done(true)
                .build();

        recommendationRequestRepository.save(recommendationRequest1);

        setupUser(true);

        page.getByText("Recommendation Requests").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText(requesteremail1);

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendationRequest() throws Exception {
    setupUser(false);

    page.getByText("Recommendation Requests").click();

    assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
    }

    @Test
    public void regular_user_can_see_create_recommendationRequest_button() throws Exception {
    setupUser(true);

    page.getByText("Recommendation Requests").click();

    assertThat(page.getByText("Create Recommendation Request")).isVisible();
    }
}