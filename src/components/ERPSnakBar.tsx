import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

function ERPSnakBar({
  open,
  onClose,
  serverity,
  message,
}: {
  open: boolean;
  onClose?: (value: boolean) => void;
  serverity: any;
  message: string;
}) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={4000}
      onClose={() => onClose && onClose(false)}
    >
      <Alert severity={serverity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ERPSnakBar;
