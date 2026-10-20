import axios from "../api/apiConfig";
import { ArticleType } from "../customTypes/customTypes";

const addArticle = async (article: ArticleType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/article", article)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const uploadArticles = async (articles: ArticleType[]) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/article/uploadArticles", articles)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateSeason = async (
  parent_id: string,
  color: string,
  season: string
) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/article/updateSeason", { parent_id, color, season })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getArticles = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/article")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getArticleList = async (
  client_id: string,
  brand_id: string,
  listType: string
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/article/articleList/${client_id}/${brand_id}/${listType}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getArticlesForOrderSelection = async (client_id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/article/articleForOrderSelection/${client_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getArticleById = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/article/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateArticle = async (article: ArticleType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`/article`, article)
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
      .delete(`/article/${id}`)
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
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesForOrderSelection,
  uploadArticles,
  getArticleList,
  updateSeason,
};
