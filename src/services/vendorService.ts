import axios from "../api/apiConfig";
import { ContactType } from "../customTypes/customTypes";

const createVendor = (vendor: any) => {
  const p = new Promise((resolve, reject) => {
    axios
      .post("/vendor", vendor)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const updateVendor = (client: any) => {
  const p = new Promise((resolve, reject) => {
    axios
      .put("/Vendor", client)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const updateVendorContact = (contact: ContactType | null) => {
  const p = new Promise((resolve, reject) => {
    axios
      .put("/vendor/contact", contact)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const deleteVendor = (clientid: string | undefined) => {
  const p = new Promise((resolve, reject) => {
    axios
      .delete(`/Vendor/${clientid}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getContactsByVendorId = async (clientId: string) => {
  try {
    const response = await axios.get(
      `/vendor/contact/VendorContacts/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getVendorById = async (vendorId: string) => {
  try {
    const response = await axios.get(`/Vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllVendors = () => {
  const p = new Promise((resolve, reject) => {
    axios
      .get(`/Vendor`)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getVendorForSelection = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/vendor/vendorForSelection`)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteContact = (contactId: number) => {
  const p = new Promise((resolve, reject) => {
    axios
      .delete(`/Vendor/contact/${contactId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

export {
  getContactsByVendorId,
  getVendorById,
  getAllVendors,
  deleteContact,
  createVendor,
  updateVendor,
  deleteVendor,
  updateVendorContact,
  getVendorForSelection,
};
