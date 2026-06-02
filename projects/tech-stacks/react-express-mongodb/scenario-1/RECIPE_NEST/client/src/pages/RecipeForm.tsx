import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipe.service";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RecipeFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [ingredients, setIngredients] = useState("flour, 2, cup");
  const [steps, setSteps] = useState("Mix ingredients\nBake 30 minutes");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const ingArr = ingredients
        .split(/\n/)
        .map((line) => {
          const [name = "", qty = "", unit = ""] = line.split(",").map((s) => s.trim());
          return { name, qty, unit };
        })
        .filter((i) => i.name && i.qty);
      const stepArr = steps
        .split(/\n/)
        .map((text, i) => ({ order: i, text: text.trim() }))
        .filter((s) => s.text);
      const recipe = await createRecipe({
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ingredients: ingArr,
        steps: stepArr,
        coverImageUrl: "",
      });
      navigate(`/recipes/${recipe._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Failed to create recipe");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-2xl">
      <h2 className="text-2xl font-bold">New Recipe</h2>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <label className="block">
        <span className="text-sm font-medium">Ingredients (one per line: name, qty, unit)</span>
        <textarea
          className="block w-full px-3 py-2 rounded-md border border-slate-300 mt-1"
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Steps (one per line)</span>
        <textarea
          className="block w-full px-3 py-2 rounded-md border border-slate-300 mt-1"
          rows={5}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </label>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <Button type="submit">Create</Button>
    </form>
  );
}
