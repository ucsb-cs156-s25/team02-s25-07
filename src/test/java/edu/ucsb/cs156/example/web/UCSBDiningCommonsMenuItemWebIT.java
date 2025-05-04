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

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {
    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Test
    public void admin_user_can_create_edit_delete_item() throws Exception {
        UCSBDiningCommonsMenuItem item1 = UCSBDiningCommonsMenuItem.builder()
                .diningCommonsCode("Portola")
                .name("Sushi")
                .station("International")
                .build();
        ucsbDiningCommonsMenuItemRepository.save(item1);
        setupUser(true);
        page.getByText("Menu Items").click();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
            .hasText("Portola");
        
        //page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete").click();
        //<td role="cell" data-testid="UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode">DLG</td>
        //<button type="button" data-testid="UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button" class="btn btn-danger">Delete</button>
        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode")).not().isVisible();

    }

    @Test
    public void regular_user_cannot_create_item() throws Exception {
        setupUser(false);

        page.getByText("Menu Items").click();

        assertThat(page.getByText("Create Item")).not().isVisible();
        //assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    }
    @Test
    public void regular_user_can_see_create_item() throws Exception {
        setupUser(true);

        page.getByText("Menu Items").click();

        assertThat(page.getByText("Create Item")).isVisible();
    }
}