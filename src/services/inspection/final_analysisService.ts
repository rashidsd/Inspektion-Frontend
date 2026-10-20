import axios from "../../api/apiConfig";
import { inspectionAnalysisType } from "../../customTypes/customTypes";

const addAnalysis = async (analysis: inspectionAnalysisType) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/finalAnalysis", analysis)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAnalysis = async (inspection_no: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalAnalysis/${inspection_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAnalysisByArticle = async (inspection_no: string, article: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalAnalysis/${inspection_no}/${article}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAnalysisByArticleTypeAndSize = async (
  inspection_no: string,
  category: string,
  article: string,
  color: string,
  size: string
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/finalAnalysis/${inspection_no}/${category}/${article}/${color}/${size}`
      )

      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteAnalysis = async (id: number) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/finalAnalysis/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  addAnalysis,
  getAnalysis,
  getAnalysisByArticleTypeAndSize,
  deleteAnalysis,
  getAnalysisByArticle,
};
