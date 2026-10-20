import ManageUsers from "../pages/settings/ManageUsers";
import ManageRoleGroup from "../pages/settings/ManageRoleGroup";
import ManageRoles from "../pages/settings/ManageRoles";
import AssignRoles from "../pages/settings/AssignRoles";
import ChangePassword from "../pages/settings/ChangePassword";
import Protected from "../components/Protected";
import UploadData from "../pages/UploadData";

const routes = [
  {
    path: "/manageUsers",
    element: (
      <Protected role="Manage Users">
        <ManageUsers />
      </Protected>
    ),
  },
  {
    path: "/ManageRoleGroup",
    element: (
      <Protected role="Manage Role Group">
        <ManageRoleGroup />
      </Protected>
    ),
  },
  {
    path: "/ManageRoles",
    element: (
      <Protected role="Manage Roles">
        <ManageRoles />
      </Protected>
    ),
  },
  {
    path: "/AssignRoles",
    element: (
      <Protected role="Assign Roles">
        <AssignRoles />
      </Protected>
    ),
  },
  {
    path: "/ChangePassword",
    element: (
      <Protected role="Change Password">
        <ChangePassword />
      </Protected>
    ),
  },
  {
    path: "/uploadData",
    element: (
      <Protected role="Upload Data">
        <UploadData />
      </Protected>
    ),
  },
];

export default routes;
