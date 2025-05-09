import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/helpRequestUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HelpRequestTable({ requests, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/helprequest/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/helprequest/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Email",
      accessor: "requesterEmail",
    },
    {
      Header: "Team ID",
      accessor: "teamID",
    },
    {
      Header: "Table or Breakout Room",
      accessor: "tableOrBreakoutRoom",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Solved",
      id: "solved",
      accessor: (key) => String(key.solved),
    },
    {
      Header: "Date",
      accessor: "localDateTime",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "HelpRequestTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestTable"),
    );
  }

  return (
    <OurTable data={requests} columns={columns} testid={"HelpRequestTable"} />
  );
}
