import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import orderRoutes from "./order_routes";
import inputRoutes from "./input_routes";
import settingRoutes from "./setting_routes";
import inspectionRouts from "./inspection_routes";
import Login from "../pages/Login";
import wipRoutes from "./wip_routes";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...settingRoutes,
      ...inputRoutes,
      ...orderRoutes,
      ...inspectionRouts,
      ...wipRoutes,
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routes;
