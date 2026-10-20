import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    Stack,
    LinearProgress
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExportDocumentDetail from "../components/ExportDocumentDetail";
import ERPSnakBar from "../components/ERPSnakBar";
import { useExportDocuments } from "../hooks/useExportDocuments";
import CircularProgress from "@mui/material/CircularProgress";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface InputFileUploadProps {
    onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputFileUpload({ onFileChange }: InputFileUploadProps) {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}

        >
            Select File
            <VisuallyHiddenInput
                type="file"
                onChange={onFileChange}
                multiple
            />
        </Button>
    );
}

function ExportDocuments() {
    const { getList, saveDocuments, removeDocument } = useExportDocuments();
    const [shippingNo, setShippingNo] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<any[]>([]);

    const fileRef = useRef<FileReader | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        serverity: "",
    });


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        try {
            setLoading(true);
            setProgress(0);
            const files = event.target.files;
            setFile(selectedFile);


            const reader = new FileReader();
            fileRef.current = reader
            reader.onprogress = (e) => {
                const percent = Math.round((e.loaded / e.total) * 100);
                setProgress(percent);
            }
            reader.readAsArrayBuffer(selectedFile);
            event.target.value = "";
            fileRef.current = null;

        } catch (error) {
            console.error("File read error:", error);
        } finally {
            setLoading(false);

        }
    };

    const handleUploadFile = async () => {
        if (!file) return;
        try {
            setLoading(true);
            const formData = new FormData();
            const record = {
                descr: description,
                shipping_no: shippingNo,
                original_name: file.name,
                stored_path: "",
                stored_name: "",
                file_extension: file.name.split('.').pop() || ""
            }
            formData.append("file", file);
            formData.append("data", JSON.stringify(record));
            await saveDocuments(formData);
            const response = await getList(shippingNo);
            setList(response);
            setFile(null);
            setDescription("");
            setProgress(0);
            setAlert({ open: true, message: "File uploaded successfully", serverity: "success" });
        } catch (error) {
            console.error("File upload error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Box component={"div"} sx={{ px: 3, pt: 3, borderBottom: "1px solid #ccc" }}>
                <Stack direction="row" justifyContent="start" gap={2} alignItems="center" mb={1}>
                    <TextField label="Shipping No" variant="outlined" size={"small"} sx={{ width: { xs: "100%", sm: "300px" } }}
                        value={shippingNo}
                        onChange={(e) => setShippingNo(e.target.value)}
                    />
                    <Button variant="contained"
                        sx={{ width: "150px" }}
                        onClick={async () => {
                            if (shippingNo.trim() === "") return;
                            await getList(shippingNo);
                        }}

                    >Fetch Data</Button>
                </Stack>

                <Stack direction="row" justifyContent="start" gap={2} alignItems="center" mb={1}>
                    <TextField label="Description" variant="outlined" size={"small"} sx={{ width: { xs: "100%", sm: "300px" } }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <InputFileUpload onFileChange={handleFileChange} />
                </Stack>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, width: '300px', borderRadius: 5, mb: 2, }} />
                <Button variant="contained" sx={{ mb: 2 }} onClick={handleUploadFile}
                    disabled={loading || shippingNo.trim() === ""} color="success">
                    Upload 
                    {loading && <CircularProgress size={24} sx={{
                        color: 'primary',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                        
                    }} />}
                    </Button>
            </Box>
            <Box sx={{ mb: 2, width: { xs: "100%", sm: "600px" }, mt: 2 }}>
                <ExportDocumentDetail />
            </Box>
            <ERPSnakBar
                open={alert.open}
                message={alert.message}
                serverity={alert.serverity}
                onClose={() => setAlert({ open: false, message: "", serverity: "" })}
            />
        </>
    )
}

export default ExportDocuments
