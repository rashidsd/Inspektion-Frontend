import axios from "../api/apiConfig";
import { InspectorType } from "../customTypes/customTypes";

const createInspector = async (inspctor: InspectorType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/inspector", inspctor)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateInspector = async (inspector: InspectorType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/inspector", inspector)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAllInspectors = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/inspector")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getInspectorById = async (id: string | undefined) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/inspector/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteInspector = async (id: string | undefined) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/inspector/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  createInspector,
  updateInspector,
  getAllInspectors,
  getInspectorById,
  deleteInspector,
};
