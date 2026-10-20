import axios from "../../api/apiConfig";
import { finalInspection } from "../../customTypes/customTypes";
import { inspectionResults } from "../../customTypes/customTypes";

const saveInspectionMaster = async (inspectionMaster: finalInspection) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/finalInspection", inspectionMaster)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateInspectionMaster = async (inspectionMaster: finalInspection) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/finalInspection", inspectionMaster)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateInspectionDetail = async (inspectionDetail: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/finalInspection/inspectionDetail", inspectionDetail)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getPOs = async (client_id: string | null, vendor_id: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/${client_id}/${vendor_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderInfo = async (order_no: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/${order_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getInspectionMaster = async (inspection_no: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/${inspection_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getInspectionList = async (from_date: string, to_date: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/inspectionList/${from_date}/${to_date}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getInspectionDetail = async (
  order_no: string | null | undefined,
  inspection_no: string | null | undefined
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/inspectionDetail/${order_no}/${inspection_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const saveInspectionResults = async (results: inspectionResults) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/finalInspection/inspectionResults", results)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getInspectionResults = async (inspection_no?: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/finalInspection/inspectionResults/${inspection_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getPOs,
  getOrderInfo,
  getInspectionDetail,
  saveInspectionMaster,
  getInspectionList,
  getInspectionMaster,
  updateInspectionMaster,
  updateInspectionDetail,
  saveInspectionResults,
  getInspectionResults,
};
