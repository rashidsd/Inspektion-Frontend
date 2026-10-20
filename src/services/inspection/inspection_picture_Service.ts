import axios from "../../api/apiConfig";

const addInspectionPicture = async (obj: any, recordType?: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/inspectionPicture", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderPictures = async (order_no: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/inspectionPicture/${order_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateRemarks = async (obj: { id: number; remarks: string }) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/inspectionPicture", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getPicturesAllArticles = async (order_no: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/inspectionPicture/all/${order_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getArticlePictures = async (
  order_no: string | null,
  article: string | null
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/inspectionPicture/${order_no}/${article}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteInspectionImage = async (id: number) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/inspectionPicture/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  addInspectionPicture,
  getOrderPictures,
  deleteInspectionImage,
  getArticlePictures,
  getPicturesAllArticles,
  updateRemarks,
};
