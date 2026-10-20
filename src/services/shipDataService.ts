import axios from "../api/apiConfig";
import { ShipDataType } from "../customTypes/customTypes";

const saveShipData = (shipData: ShipDataType[]) => {
  const p = new Promise((resolve, reject) => {
    axios
      .post("/shipData", shipData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getShipData = async (clientId: string, vendorId: string) => {
  try {
    const response = await axios.get(
      `/shipData/byClientAndVendor/${clientId}/${vendorId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getShipDataAll = async (fromDate: string, toDate: string) => {
  try {
    const response = await axios.get(`/shipData/${fromDate}/${toDate}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getShipDataByClient = async (
  client_id: string,
  fromDate: string,
  toDate: string,
  openClose: boolean
) => {
  try {
    const response = await axios.get(
      `/shipData/${client_id}/${fromDate}/${toDate}/${openClose}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const articleSelection = async (order_no?: string) => {
  try {
    const response = await axios.get(`/shipData/articleSelection/${order_no}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteShipData = async (id?: number) => {
  try {
    const response = await axios.delete(`/shipData/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const updateBillNoAndDate = async (ship_no: string, bl_no: string, bl_date: string) => {
  try {
    const response = await axios.put("/shipData/updateBlNoAndDate", {ship_no, bl_no, bl_date});
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const updateRemarks = async (id: number, remarks: string) => {  
  try {
    const response = await axios.put("/shipData/updateRemarks", { id, remarks });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const paymentData = async (client_id:string,fromDate:string,toDate:string,openClose:boolean)=>{
  try {
    
    const response = await axios.get(`/shipData/paymentData/${client_id}/${fromDate}/${toDate}/${openClose}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const updatePaymentStatusAndRemarks = async (fieldName:string,fieldValue:any,ship_no:string) => {
  try {
    const response = await axios.put("/shipData/updatePaymentStatusAndRemarks", { fieldName, fieldValue, ship_no });
   
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const updateShipDataByShipNo = async (ship_no:string, editShipNo:string, ship_date:string | null, bl_no:string | null, bl_date:string | null,is_close:boolean) => {
  try {
    const response = await axios.put("/shipData/updateShipDataByShipNo", { ship_no, editShipNo, ship_date, bl_no, bl_date, is_close });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const changeShipmentStatus = async (ship_no:string, is_close:boolean) => {
  try {
    const response = await axios.put("/shipData/changeShipmentStatus", { ship_no, is_close });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const updateShipField = async (ship_no: string, field: string, value: string) => {
  try {
    const response = await axios.put("/shipData/updateShipField", { ship_no, field, value });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export  {
  saveShipData,
  getShipData,
  articleSelection,
  deleteShipData,
  getShipDataAll,
  getShipDataByClient,
  updateBillNoAndDate,
  updateRemarks, 
  paymentData,
  updatePaymentStatusAndRemarks,
  updateShipDataByShipNo,
  changeShipmentStatus,
  updateShipField
};
