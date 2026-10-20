import axios from "../api/apiConfig";
import { ArticleSpecType } from "../customTypes/customTypes";

async function addArticleSpec(obj: any) {
  return new Promise((resolve, reject) => {
    axios
      .post("/articleSpec", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getArticleSpecs(articleId: string | undefined) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/articleSpec/${articleId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function deleteArticleSpec(id: number) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/articleSpec/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { addArticleSpec, getArticleSpecs, deleteArticleSpec };
