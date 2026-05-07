import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { FeedPage } from "./pages/Feed";
import { RecipeDetailPage } from "./pages/RecipeDetail";
import { RecipeFormPage } from "./pages/RecipeForm";
import { ProfilePage } from "./pages/Profile";
import { SavedRecipesPage } from "./pages/SavedRecipes";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FeedPage />} />
        <Route path="recipes/new" element={<RecipeFormPage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="profile/:username" element={<ProfilePage />} />
        <Route path="saved" element={<SavedRecipesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}
