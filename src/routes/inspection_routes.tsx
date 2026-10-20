import FinalInspection from "../pages/FinalInspection";
import Protected from "../components/Protected";
import Main from "../Reports/FinalInspection/Main";

const routes = [
  {
    path: "/inspection/finalnspection",
    element: (
      <Protected role="Final Inspection">
        <FinalInspection />
      </Protected>
    ),
  },
  {
    path: "/inspection/finalnspection/report",
    element: <Main />,
  },
];

export default routes;
