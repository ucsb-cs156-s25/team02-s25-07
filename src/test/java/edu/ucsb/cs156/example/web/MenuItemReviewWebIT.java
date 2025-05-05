package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuitemreview() throws Exception {
        setupUser(true);

        page.getByText("MenuItemReview").click();

        page.getByText("Create MenuItemReview").click();
        assertThat(page.getByText("Create New MenuItemReview")).isVisible();
        page.getByLabel("ItemId").fill("329");
        page.getByLabel("ReviewerEmail").fill("yy@ucsb.edu");
        page.getByLabel("Stars").fill("5");
        page.getByLabel("Comments").fill("Blimey!");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Create")).click();


        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
                .hasText("Blimey!");
    }

    @Test
    public void regular_user_cannot_create_menuitemreview() throws Exception {
        setupUser(false);

        page.getByText("MenuItemReview").click();

        assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }
}
