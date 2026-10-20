import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ERPSnakBar from "../components/ERPSnakBar";
import { updateSeason } from "../services/articleService";
import TextField from "@mui/material/TextField";

function UpdateSeason({
  parent_id,
  color,
  season,
}: {
  parent_id: string;
  color: string;
  season: string;
}) {
  const [newSeason, setNewSeason] = useState<string>(season);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  console.log("id", parent_id);

  const handleUpdate = async () => {
    try {
      const result: any = await updateSeason(parent_id, color, newSeason);
      if (result.status) {
        setAlert({
          open: true,
          message: `season updated successfully`,
          serverity: "success",
        });
      } else {
        setAlert({
          open: true,
          message: `Failed to update `,
          serverity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Error updating `,
        serverity: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          height: "100%",
        }}
      >
        <TextField
          size="small"
          value={newSeason}
          onChange={(e) => {
            setNewSeason(e.target.value);
          }}
        />
        <IconButton
          size="small"
          onClick={handleUpdate}
          color="success"
          sx={{ padding: 0 }}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ position: "absolute", top: 300, left: 0 }}>
        <ERPSnakBar
          open={alert.open}
          message={alert.message}
          serverity={alert.serverity}
          onClose={() =>
            setAlert({
              ...alert,
              open: false,
            })
          }
        />
      </Box>
    </>
  );
}

export default UpdateSeason;
