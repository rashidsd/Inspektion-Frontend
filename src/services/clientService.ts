import axios from "../api/apiConfig";
import { BrandType, ContactType } from "../customTypes/customTypes";

const createClient = (client: any) => {
  const p = new Promise((resolve, reject) => {
    axios
      .post("/client", client)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const updateClient = (client: any) => {
  const p = new Promise((resolve, reject) => {
    axios
      .put("/client", client)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const updateClientContact = (contact: ContactType | null) => {
  const p = new Promise((resolve, reject) => {
    axios
      .put("/client/contact", contact)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const deleteClient = (clientid: string | undefined) => {
  const p = new Promise((resolve, reject) => {
    axios
      .delete(`/client/${clientid}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getContactsByClientId = async (clientId: string) => {
  try {
    const response = await axios.get(
      `/client/contact/clientContacts/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getClientById = async (clientId: string) => {
  try {
    const response = await axios.get(`/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllClients = () => {
  const p = new Promise((resolve, reject) => {
    axios
      .get(`/client`)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const getClientForSelection = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/client/clientForSelection`)
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
      .delete(`/client/contact/${contactId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const deleteBrand = (brandtId: string) => {
  const p = new Promise((resolve, reject) => {
    axios
      .delete(`/client/brand/${brandtId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return p;
};

const brandByClient = (clientId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/brand/client/${clientId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateClientBrand = (brand: BrandType | null) => {
  const p = new Promise((resolve, reject) => {
    axios
      .put("/client/brand", brand)
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
  getContactsByClientId,
  getClientById,
  getAllClients,
  deleteContact,
  createClient,
  updateClient,
  deleteClient,
  updateClientContact,
  deleteBrand,
  updateClientBrand,
  getClientForSelection,
  brandByClient,
};
