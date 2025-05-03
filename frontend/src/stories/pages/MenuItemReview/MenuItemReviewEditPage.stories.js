import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
  component: MenuItemReviewEditPage,
};

const Template = () => <MenuItemReviewEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
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
    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeMIRs[0], {
        status: 200,
      });
    }),
    http.put("/api/menuitemreview", () => {
      return HttpResponse.json(
        {
          id: "17",
          itemId: "105",
          reviewerEmail: "alexA@ucsb.edu - edited",
          stars: "4",
          comments:
            "Absolutely delicious! Highly recommend the truffle pasta. - edited",
        },
        { status: 200 },
      );
    }),
  ],
};
