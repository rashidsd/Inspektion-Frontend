import WipDataVendor from "../pages/WipDataVendor";
import Protected from "../components/Protected";
import WipReport2 from "../pages/WipReport2";

const routes = [
  {
    path: "/wipDataVendor",
    element: (
      <Protected role="WIP Data">
        <WipDataVendor />
      </Protected>
    ),
  },
  {
    path: "/wipReport",
    element: (
      <Protected role="WIP Report">
        <WipReport2 />
      </Protected>
    ),
  },
];

export default routes;
