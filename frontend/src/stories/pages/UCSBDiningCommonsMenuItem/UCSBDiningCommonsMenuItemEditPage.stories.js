import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage",
  component: UCSBDiningCommonsMenuItemsEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemsEditPage storybook={true} />;

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
    http.get("/api/menuitems", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemFixtures.threeDiningCommonsMenuItem[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/menuitems", () => {
      return HttpResponse.json(
        {
          id: "17",
          diningCommonsCode: "dAnswer",
          name: "nAnswer",
          station: "sAnswer",
        },
        { status: 200 },
      );
    }),
  ],
};
