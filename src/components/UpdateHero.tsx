import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ERPSnakBar from "../components/ERPSnakBar";
import { updateHero } from "../services/parent_articleService";

function UpdateHero({ id, hero }: { id: string; hero: boolean }) {
  const [checked, setChecked] = useState(hero ? true : false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleUpdate = async () => {
    try {
      const result: any = await updateHero(id, checked);
      if (result.status) {
        setAlert({
          open: true,
          message: `Article No: ${id} updated successfully`,
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
        <Switch
          size="small"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
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

export default UpdateHero;
