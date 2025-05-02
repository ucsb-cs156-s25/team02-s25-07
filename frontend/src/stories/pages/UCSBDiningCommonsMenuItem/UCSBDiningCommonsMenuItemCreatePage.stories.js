import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";

import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
export default {
  title:
    "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage",
  component: UCSBDiningCommonsMenuItemCreatePage,
};

const Template = () => <UCSBDiningCommonsMenuItemCreatePage storybook={true} />;

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
    http.post("/api/menuitems/post", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemFixtures.oneDiningCommonsMenuItem,
        { status: 200 },
      );
    }),
  ],
};
