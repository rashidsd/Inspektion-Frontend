import axios from "../../api/apiConfig";
import { UserType } from "../../customTypes/customTypes";

const createUser = async (user: UserType) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/user", user)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateUser = async (user: UserType) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/user", user)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/user")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getUsersForSelection = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/user/userForSelection")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const passwordChange = async (obj: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/user/changePassword", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteUser = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/user/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUsersForSelection,
  passwordChange,
};
