package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.Article;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    ArticlesRepository articlesRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        // arrange
        LocalDateTime dateAdded = LocalDateTime.parse("2022-01-03T00:00:00");
        
        Article article = Article.builder()
                .title("Test Article")
                .url("https://example.com")
                .explanation("This is a test article")
                .email("test@example.com")
                .dateAdded(dateAdded)
                .build();
                
        articlesRepository.save(article);

        // act
        MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(article);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_article() throws Exception {
        // arrange
        LocalDateTime expectedDate = LocalDateTime.parse("2022-01-03T00:00:00");
        
        Article expectedArticle = Article.builder()
                .id(1L)
                .title("New Article")
                .url("https://example.org")
                .explanation("This is a new article")
                .email("admin@example.com")
                .dateAdded(expectedDate)
                .build();

        // act
        MvcResult response = mockMvc.perform(
                post("/api/articles/post?title=New Article&url=https://example.org&explanation=This is a new article&email=admin@example.com&dateAdded=2022-01-03")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(expectedArticle);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
    
    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_articles_by_date_range() throws Exception {
        // arrange
        LocalDateTime date1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime date2 = LocalDateTime.parse("2022-02-15T00:00:00");
        LocalDateTime date3 = LocalDateTime.parse("2022-03-20T00:00:00");
        
        Article article1 = Article.builder()
                .title("Article 1")
                .url("https://example1.com")
                .explanation("First article")
                .email("test1@example.com")
                .dateAdded(date1)
                .build();
                
        Article article2 = Article.builder()
                .title("Article 2")
                .url("https://example2.com")
                .explanation("Second article")
                .email("test2@example.com")
                .dateAdded(date2)
                .build();
                
        Article article3 = Article.builder()
                .title("Article 3")
                .url("https://example3.com")
                .explanation("Third article")
                .email("test3@example.com")
                .dateAdded(date3)
                .build();
                
        articlesRepository.save(article1);
        articlesRepository.save(article2);
        articlesRepository.save(article3);

        // act - get articles between Jan 1 and Feb 28
        MvcResult response = mockMvc.perform(get("/api/articles/bydate?startDate=2022-01-01&endDate=2022-02-28"))
                .andExpect(status().isOk()).andReturn();

        // assert - should return articles 1 and 2 but not 3
        Article[] expectedArticles = { article1, article2 };
        String expectedJson = mapper.writeValueAsString(expectedArticles);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}
