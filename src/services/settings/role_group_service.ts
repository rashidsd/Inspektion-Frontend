import axios from "../../api/apiConfig";
import { RoleGropType } from "../../customTypes/customTypes";

const createRoleGroup = async (roleGroup: RoleGropType) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/roleGroup", roleGroup)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateRoleGrop = async (roleGroup: RoleGropType) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/roleGroup", roleGroup)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAllRoleGroups = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/roleGroup")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getRoleGroupsForSelection = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/roleGroup/roleGroupForSelection")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteRoleGroup = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/roleGroup/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getAllRoleGroups,
  createRoleGroup,
  updateRoleGrop,
  deleteRoleGroup,
  getRoleGroupsForSelection,
};
