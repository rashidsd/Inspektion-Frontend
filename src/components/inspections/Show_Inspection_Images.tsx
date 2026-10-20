import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { deleteInspectionImage } from "../../services/inspection/inspection_picture_Service";
import { updateRemarks } from "../../services/inspection/inspection_picture_Service";
import { getTableHeaderBg } from "../../util/tableStyles";

function Show_Inspection_Images({
  imageList,
  descr,
}: {
  imageList: any[];
  descr: string;
}) {
  const [pictures, setPictures] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    setPictures(imageList);
  }, [imageList]);

  const handleDeleteImage = async (id: number) => {
    try {
      const response: any = await deleteInspectionImage(id);
      if (response.data) {
        const newList = pictures.filter((f) => f.id !== id);
        setPictures(newList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndEdit = async (id: number) => {
    setIsEdit(false);
    const updatedList = pictures.map((p) => {
      if (p.id === id) {
        return { ...p, remarks: remarks };
      }
      return p;
    });
    const response: any = await updateRemarks({ id: id, remarks: remarks });
    if (response.data) {
      setPictures(updatedList);
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Typography textAlign={"center"} variant="h6">
        {descr}
      </Typography>

      <Box sx={{ px: 10 }}>
        <Grid container spacing={1}>
          {pictures.map((picture: any, index: number) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} gap={1} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: 320,
                    height: 300,
                  }}
                >
                  <img key={index} src={picture.url} alt={picture.remarks} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: (theme) => getTableHeaderBg(theme),
                    }}
                  >
                    {" "}
                    {isEdit ? (
                      <TextField
                        sx={{ p: 0.5 }}
                        size="small"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        fullWidth
                        multiline
                      />
                    ) : (
                      <Typography
                        sx={{
                          px: 1,
                          flex: 1,
                          fontSize: 12,
                        }}
                      >
                        {picture.remarks}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isEdit ? (
                        <IconButton onClick={() => handleEndEdit(picture.id)}>
                          <DoneIcon color="secondary" sx={{ fontSize: 17 }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            setIsEdit(true);
                            setRemarks(picture.remarks);
                          }}
                        >
                          <EditIcon color="secondary" sx={{ fontSize: 17 }} />
                        </IconButton>
                      )}

                      <IconButton onClick={() => handleDeleteImage(picture.id)}>
                        <DeleteIcon color="error" sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default Show_Inspection_Images;
