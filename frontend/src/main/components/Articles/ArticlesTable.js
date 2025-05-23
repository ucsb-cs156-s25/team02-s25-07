import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/articleUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function ArticlesTable({ articles, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    return navigate(`/articles/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/articles/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    return deleteMutation.mutate(cell);
  };

  const baseColumns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Url",
      accessor: "url",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Date Added",
      accessor: "dateAdded",
    },
  ];

  const columns = [...baseColumns];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "ArticlesTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "ArticlesTable"),
    );
  }

  return (
    <OurTable data={articles} columns={columns} testid={"ArticlesTable"} />
  );
}
