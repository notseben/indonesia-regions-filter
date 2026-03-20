import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FilterPage, loader as filterLoader } from "./FilterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FilterPage />,
    loader: filterLoader,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
