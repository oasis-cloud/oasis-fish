import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import ListPage from "./pages/ListPage";
import FishDetailPage from "./pages/FishDetailPage";
import EditPage from "./pages/EditPage";
import { InstallPrompt } from "./components/install-prompt";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/fish/:id" element={<FishDetailPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
      <InstallPrompt />
    </>
  );
}

