import axios from "../api/apiConfig";
import { ColoryType } from "../customTypes/customTypes";

async function addColor(color: ColoryType) {
  return new Promise((resolve, reject) => {
    axios
      .post("/color", color)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function uploadColors(colors: ColoryType[]) {
  return new Promise((resolve, reject) => {
    axios
      .post("/color/uploadColors", colors)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getAllColors() {
  return new Promise((resolve, reject) => {
    axios
      .get("/color")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getColorsForSelection() {
  return new Promise((resolve, reject) => {
    axios
      .get("/color/ColorsForSelection")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function findColorById(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/color/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function deleteColor(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/color/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function updateColor(color: ColoryType | null) {
  return new Promise((resolve, reject) => {
    axios
      .put("/color", color)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  addColor,
  getAllColors,
  findColorById,
  deleteColor,
  updateColor,
  getColorsForSelection,
  uploadColors,
};
