import react from "react";
import { createRoot,Root } from "react-dom/client";

import { Button,
    Typography,
    Paper,
    Box
 } from "@mui/material";

 const ShowConfirmationDlg = ({title}:{title:string}):Promise<boolean>=> {
   
    return new Promise((resolve)=>{
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root:Root = createRoot(container);

        const handleConfirm = () => {
            resolve(true);
            cleanup();
        };

        const handleCancel = () => {
            resolve(false);
            cleanup();
        };

        const cleanup = () => {
            root.unmount();
            document.body.removeChild(container);
        };

        root.render(
            <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex:1300 }}>
            <Paper elevation={2} sx={{ padding: 2, maxWidth: 300 }}>
                <Typography variant="h6"  textAlign={"center"} sx={{mt:-1, mb:2}}>
                    Confirmation
                </Typography>
                <Typography variant="body2" >
                    {title }
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleConfirm}
                    sx={{ marginRight: 1,width:70,textTransform:"none" }}
                    size="small"
                >
                    OK
                </Button>
                <Button variant="outlined" onClick={handleCancel} color="error"
                 sx={{width:70,textTransform:"none"}}
                 size="small"
                 >
                    Cancel
                </Button>
                </Box>
            </Paper>
            </Box>
        );
    });
};

export default ShowConfirmationDlg;