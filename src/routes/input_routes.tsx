import AddClients from "../pages/AddClients";
import AddVendors from "../pages/AddVendors";
import AddCategory from "../pages/AddCategory";
import AddColor from "../pages/AddColor";
import AddSize from "../pages/AddSize";
import AddArticle from "../pages/AddArticle";
import Protected from "../components/Protected";
import AddParentArticle from "../pages/AddParentArticle";
import ArticleList from "../pages/ArticleList";
import AddInspector from "../pages/AddInspector";

const routes = [
  {
    path: "/addclient",
    element: (
      <Protected role="Add Client">
        <AddClients />
      </Protected>
    ),
  },
  {
    path: "/addvendor",
    element: (
      <Protected role="Add Vendor">
        <AddVendors />
      </Protected>
    ),
  },
  {
    path: "/addColor",
    element: (
      <Protected role="Add Color">
        <AddColor />
      </Protected>
    ),
  },
  {
    path: "/addSize",
    element: (
      <Protected role="Add Size">
        <AddSize />
      </Protected>
    ),
  },
  {
    path: "/addCategory",
    element: (
      <Protected role="Add Category">
        <AddCategory />
      </Protected>
    ),
  },
  {
    path: "/addArticle",
    element: (
      <Protected role="Add Article">
        <AddArticle />
      </Protected>
    ),
  },
  {
    path: "/parentArticle",
    element: (
      <Protected role="Parent Article">
        <AddParentArticle />
      </Protected>
    ),
  },
  {
    path: "/articleList",
    element: (
      <Protected role="Article List">
        <ArticleList />
      </Protected>
    ),
  },
  {
    path: "/addInspector",
    element: (
      <Protected role="Add Inspector">
        <AddInspector />
      </Protected>
    ),
  },
];

export default routes;
