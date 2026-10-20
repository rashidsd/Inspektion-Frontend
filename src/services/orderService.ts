import axios from "../api/apiConfig";
import { OrderDetailType, OrderMasterType } from "../customTypes/customTypes";

export const createOrder = async (order: OrderMasterType) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/order", order)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const uploadOrder = async (order: any) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/order/uploadOrder", order)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrder = async (order: OrderMasterType) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/order", order)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllOrders = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/order")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllOrdersWithDateRange = async (
  fromDate: string,
  toDate: string
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/order/${fromDate}/${toDate}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllOrdersWithDateRangeByClientId = async (
  client_id: string,
  fromDate: string,
  toDate: string
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/order/${client_id}/${fromDate}/${toDate}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const findByOrderNo = async (order_no: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/order/${order_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const findByOrderNoWithShiped = async (order_no: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/order/orderList/shipped/${order_no}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateDetailRecord = async (obj: OrderDetailType | null) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/order/detail", obj)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrderStatus = async (order_no: string, status: boolean) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/order/orderStatus", { order_no, status })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteDetailRecord = async (id: number) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/order/detail/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteRecord = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/order/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  createOrder,
  getAllOrders,
  findByOrderNo,
  updateDetailRecord,
  deleteDetailRecord,
  uploadOrder,
  updateOrderStatus,
  getAllOrdersWithDateRangeByClientId,
  findByOrderNoWithShiped,
};
