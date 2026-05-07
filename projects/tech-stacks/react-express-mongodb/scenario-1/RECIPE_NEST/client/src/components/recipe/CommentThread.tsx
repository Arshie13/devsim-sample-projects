import { useEffect, useState } from "react";
import { listComments, postComment, type CommentRecord } from "../../services/comment.service";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function CommentThread({ recipeId }: { recipeId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentRecord[] | null>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listComments(recipeId).then(setComments).catch(() => setComments([]));
  }, [recipeId]);

  async function submit() {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const created = await postComment(recipeId, body.trim());
      setComments((c) => (c ? [created, ...c] : [created]));
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  if (!comments) return <LoadingSpinner label="Loading comments..." />;
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Comments ({comments.length})</h3>
      {user ? (
        <div className="flex gap-2">
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Leave a comment..." />
          <Button onClick={submit} disabled={submitting || !body.trim()}>Post</Button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Log in to leave a comment.</p>
      )}
      <ul className="divide-y divide-slate-200">
        {comments.map((c) => (
          <li key={c._id} className="py-2">
            <p className="text-sm text-slate-600">
              @{typeof c.authorId === "string" ? c.authorId : c.authorId.username}
            </p>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
