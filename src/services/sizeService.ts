import axios from "../api/apiConfig";
import { SizeType } from "../customTypes/customTypes";

async function addSize(size: SizeType) {
  return new Promise((resolve, reject) => {
    axios
      .post("/size", size)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function uploadSizes(sizes: SizeType[]) {
  return new Promise((resolve, reject) => {
    axios
      .post("/size/uploadSizes", sizes)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getAllSizes() {
  return new Promise((resolve, reject) => {
    axios
      .get("/size")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getSizesForSelection() {
  return new Promise((resolve, reject) => {
    axios
      .get("/size/sizeForSelection")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function findSizeById(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/size/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function deleteSize(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/size/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function updateSize(color: SizeType | null) {
  return new Promise((resolve, reject) => {
    axios
      .put("/size", color)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  addSize,
  getAllSizes,
  findSizeById,
  deleteSize,
  updateSize,
  getSizesForSelection,
  uploadSizes,
};
