import axios from "../api/apiConfig";
import { CategoryType } from "../customTypes/customTypes";

async function addCategory(color: CategoryType) {
  return new Promise((resolve, reject) => {
    axios
      .post("/category", color)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function uploadCategories(categories: CategoryType[]) {
  return new Promise((resolve, reject) => {
    axios
      .post("/category/uploadCategories", categories)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getAllCategories() {
  return new Promise((resolve, reject) => {
    axios
      .get("/category")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getCategoriesForSelection() {
  return new Promise((resolve, reject) => {
    axios
      .get("/category/forSelection")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function findCategoryById(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/category/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function deleteCategory(id: string) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/category/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function updateCategory(color: CategoryType | null) {
  return new Promise((resolve, reject) => {
    axios
      .put("/category", color)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  addCategory,
  getAllCategories,
  findCategoryById,
  deleteCategory,
  updateCategory,
  getCategoriesForSelection,
  uploadCategories,
};
