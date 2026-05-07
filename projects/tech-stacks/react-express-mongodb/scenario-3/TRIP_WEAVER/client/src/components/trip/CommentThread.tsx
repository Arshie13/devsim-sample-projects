import { useState } from "react";
import type { Comment } from "../../types/trip";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface CommentThreadProps {
  comments: Comment[];
  onSubmit: (body: string) => Promise<void>;
}

export function CommentThread({ comments, onSubmit }: CommentThreadProps) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar size="sm" alt={comment.authorId as string} />
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-sm text-gray-800">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <Button type="submit" size="sm" disabled={submitting || !body.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
}
