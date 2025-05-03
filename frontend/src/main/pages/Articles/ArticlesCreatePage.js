import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesCreatePage({ storybook = false }) {
  const buildApiRequest = (articleData) => ({
    url: "/api/articles/post",
    method: "POST",
    params: {
      title: articleData.title,
      url: articleData.url,
      explanation: articleData.explanation,
      email: articleData.email,
      dateAdded: articleData.dateAdded,
    },
  });

  const handleSuccess = (articleData) => {
    toast(
      `New article Created - id: ${articleData.id} title: ${articleData.title}`,
    );
  };

  const mutation = useBackendMutation(
    buildApiRequest,
    { onSuccess: handleSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/articles/all"],
  );

  const { isSuccess } = mutation;

  const handleSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/articles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Article</h1>

        <ArticlesForm submitAction={handleSubmit} />
      </div>
    </BasicLayout>
  );
}
