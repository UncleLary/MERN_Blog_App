import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

export default function DeletePost() {
  const { id } = useParams();
  const [redirectToMainPage, setRedirect] = useState(false);

  useEffect(() => {
    async function deletePost() {
      const response = await fetch(`http://localhost:4444/post/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        alert("Problem occurred when trying to delete post!");
      }
    }

    deletePost();
  }, [id]);

  if (redirectToMainPage) {
    return <Navigate to={"/"} />;
  }

  return (
    alert("Post deleted!")
  );
}
