import axios from "../api/apiConfig"

const createDocument = async (data: any) => { 
    try {
       
        const response = await axios.post('/exportDocument', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
const getDocumentsByShippingNo = async (shipping_no: string) => { 
    try {
        const response = await axios.get(`/exportDocument/${encodeURIComponent(shipping_no)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
const deleteDocument = async (id: number) => { 
    try {
        const response = await axios.delete(`/exportDocument/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default  {
    createDocument,
    getDocumentsByShippingNo,
    deleteDocument
}