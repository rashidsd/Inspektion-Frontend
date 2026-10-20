import axios from "../api/apiConfig";
import { WipData } from "../customTypes/customTypes";

const createWip = (wip_data: WipData[]) => {
  const p = new Promise((resolve, reject) => {
    axios
      .post("/wip", wip_data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

// const createWip = (wip_data: WipData) => {
//   const p = new Promise((resolve, reject) => {
//     axios
//       .post("/wip", wip_data)
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
//   return p;
// };
const getVendorWip = (client_id: string, vendor_id: string) => {
  const p = new Promise((resolve, reject) => {
    axios
      .get(`/wip/${client_id}/${vendor_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getClientWip = (client_id: string) => {
  const p = new Promise((resolve, reject) => {
    axios
      .get(`/wip/${client_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

export { createWip, getVendorWip, getClientWip };
