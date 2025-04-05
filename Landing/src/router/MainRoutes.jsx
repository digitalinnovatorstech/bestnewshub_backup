import NewMainLayout from "@/components/newLandingLayout/mainLayout/MainLayout";
import { createMemoryRouter } from "react-router-dom";

export const baseRoutes = createMemoryRouter([
  {
    path: "/",
    element: <NewMainLayout />,
  },
]);
