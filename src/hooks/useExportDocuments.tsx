import React,{ createContext ,useCallback,useMemo,useState} from "react";
import exportDocumentService from "../services/exportDocumentService";


type ExportDocumentsType = {
    id?: number | null;
    shipping_no?: string;
    descr?: string;
    original_name?: string;
    stored_name?: string;
    stored_path?: string;
    file_extension?: string;
    created_at?: string;
}

type ExportDocumentsContextType = {
    getList:(shipping_no:string) => Promise<ExportDocumentsType[]>;
    saveDocuments: (data: any) => Promise<void>; 
    removeDocument: (id: number) => Promise<void>;
    currList: ExportDocumentsType[];  
}

export const ExportDocumentsContext = createContext<ExportDocumentsContextType | undefined>(undefined);

export const ExportDocumentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currList, setCurrList] = useState<ExportDocumentsType[]>([]);
 
    const getList = useCallback(async (shipping_no:string) => {
       try {
           const response = await exportDocumentService.getDocumentsByShippingNo(shipping_no);
           setCurrList(response.data);
           return response.data as ExportDocumentsType[];
       } catch (error) {
           throw error;
       } 
    },[]);

    const saveDocuments = useCallback(async (data:any) => {
      try {

        const response = await exportDocumentService.createDocument(data);
        return response.data;
      } catch (error) {
       console.log("Error saving document:", error);
        throw error;
      }
    },[]);

    const removeDocument = useCallback(async (id: number) => {
        try {
            const response = await exportDocumentService.deleteDocument(id);
            return response.data;
            } catch (error) {
            console.log("Error deleting document:", error);
            throw error;
            } 
    },[]);

    const values = useMemo(() => ({ getList, saveDocuments, removeDocument,currList }), [getList, saveDocuments, removeDocument,currList]);

   return (
    <ExportDocumentsContext.Provider value={values}>
      {children}
    </ExportDocumentsContext.Provider>
  );    
}

export const useExportDocuments = () => {
    const context = React.useContext(ExportDocumentsContext);
    if (!context) {
        throw new Error("useExportDocuments must be used within an ExportDocumentsProvider");
    }
    return context;
}


