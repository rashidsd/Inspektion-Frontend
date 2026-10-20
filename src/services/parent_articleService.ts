import axios from "../api/apiConfig";
import { ParentArticleType } from "../customTypes/customTypes";

const addArticle = async (article: ParentArticleType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/parentarticle", article)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const uploadParentArticles = async (article: ParentArticleType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/parentarticle/uploadParentArticles", { list: article })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateHero = async (id: string, is_hero: boolean) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/parentarticle/updateHero", { id, is_hero })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// const uploadArticles = async (articles: ArticleType[]) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .post("/article/uploadArticles", articles)
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

const getParentArticles = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/parentarticle")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// const getArticlesForOrderSelection = async (client_id: string) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`/article/articleForOrderSelection/${client_id}`)
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

const getArticleById = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/parentarticle/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getParentArticlesByClientId = async (client_id: string | undefined) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/parentarticle/byClient/${client_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateArticle = async (article: ParentArticleType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`/parentarticle`, article)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteArticle = async (id: string | undefined) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/parentarticle/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  addArticle,
  getParentArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  updateHero,
  uploadParentArticles,
  getParentArticlesByClientId,
};
