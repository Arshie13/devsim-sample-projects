import { useState, useEffect } from "react";
import { listComments, createComment, type Comment } from "../../services/comment.service";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { timeAgo } from "../../utils/formatters";

interface CommentThreadProps {
  workoutId: string;
}

export function CommentThread({ workoutId }: CommentThreadProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listComments(workoutId).then(setComments).catch(console.error);
  }, [workoutId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const comment = await createComment(workoutId, body.trim());
      setComments((prev) => [...prev, comment]);
      setBody("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Training Notes ({comments.length})</h3>

      {comments.map((c) => (
        <div key={c._id} className="flex gap-3">
          <Avatar initials={c.author?.username ?? "?"} size="sm" />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">@{c.author?.username ?? "unknown"}</span>
              <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700 mt-0.5">{c.body}</p>
          </div>
        </div>
      ))}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Add a training note…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button size="sm" type="submit" disabled={loading || !body.trim()}>Post</Button>
        </form>
      )}
    </div>
  );
}
