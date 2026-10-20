import axios from "../../api/apiConfig";
import { RoleType } from "../../customTypes/customTypes";

const createRole = async (role: RoleType) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/role", role)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateRole = async (role: RoleType) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/role", role)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAllRoles = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/role")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getUserRoles = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/userRole/userRoles/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const updateUserRoles = async (obj: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/userRole", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteRole = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/role/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getUserRoles,
  updateUserRoles,
};
