import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";

const meta = {
  title: "pages/Articles/ArticlesCreatePage",
  component: ArticlesCreatePage,
};
export default meta;

const ArticleCreateTemplate = () => <ArticlesCreatePage storybook={true} />;

export const DefaultView = ArticleCreateTemplate.bind({});

DefaultView.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.post("/api/articles/post", () => {
      return HttpResponse.json({ success: true }, { status: 200 });
    }),
  ],
};
