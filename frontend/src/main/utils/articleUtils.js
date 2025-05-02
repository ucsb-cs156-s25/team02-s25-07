import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(`Article deletion: ${message}`);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  const { id } = cell.row.values;
  
  return {
    url: "/api/articles",
    method: "DELETE",
    params: { id },
  };
}