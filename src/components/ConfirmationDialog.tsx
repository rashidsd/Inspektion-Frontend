import React, { useState,useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";

function ConfirmationDialog({
  open,
  onCancel,
  onConfirm,
  title,
  content,
  btnColor,
}: {
  open: boolean;
  onCancel?: (value: boolean) => void;
  onConfirm?: () => void;
  title?: string;
  content?: string;
  btnColor?: any;
}) {

  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      PaperProps={{
        style: {
          width: "300px",
          maxWidth: "100%",
        },
      }}
      open={open}
      onClose={() => onCancel && onCancel(false)}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)", flex: 1 }}
            variant="h6"
            component="div"
          >
            {title || "Deletion"}
          </Typography>
          <IconButton
            sx={{ mt: "-20px", mr: "-20px" }}
            onClick={() => onCancel && onCancel(false)}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{content || "sure to delete ?"}</DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pb: 2,
          pr: 2,
          gap: 1,
        }}
      >
        <Button
          sx={{ width: "80px" }}
          variant="contained"
          onClick={onConfirm}
          color={btnColor || "primary"}
          disabled={loading}
        >
          OK
         
        </Button>
      </Box>
    </Dialog>
  );
}

export default ConfirmationDialog;
