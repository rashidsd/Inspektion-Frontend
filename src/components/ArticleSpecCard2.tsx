import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Info } from "@mui/icons-material";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import { deleteArticleSpec } from "../services/articleSpecService";
import { Icon } from "@mui/material";

function ArticleSpecCard2({
  id,
  descr,
  specUrl,
  articleSpecs,
}: {
  id: string;
  descr: string;
  specUrl: string;
  articleSpecs: () => void;
}) {
  const [openDelConfirmation, setOpenDelConfirmation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [scale, setScale] = useState(1);

  const handleDelete = async () => {
    try {
      await deleteArticleSpec(Number(id));
      articleSpecs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1)); // Min zoom 1x
  };

  const specInfo = (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{ m: 0, p: 0, height: 60 }}
      >
        <Typography
          sx={{
            color: (theme) => theme.palette.common.white,
            fontSize: 11,
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: 0.6,
            textAlign: "justify",

            px: 0.5,
            pt: 0.5,
            flex: 1,
          }}
        >
          {descr}
        </Typography>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          sx={{ mr: 0.5 }}
        >
          <IconButton
            onClick={() => setOpenDelConfirmation(true)}
            sx={{ p: 0 }}
          >
            <Delete
              sx={{
                fontSize: 19,
                mb: 0.5,
                color: (theme) => theme.palette.common.white,
              }}
            />
          </IconButton>
          <IconButton onClick={() => setShowInfo(true)} sx={{ p: 0 }}>
            <Info
              sx={{
                fontSize: 19,
                color: (theme) => theme.palette.common.white,
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Box
        sx={{
          borderRadius: 1,
          border: 1,
          width: 190,
          height: 190,
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
          }}
        >
          <img
            src={specUrl}
            width={"100%"}
            height={190}
            alt="spec"
            style={{ objectFit: "fill", flex: 1 }}
          />

          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",

              height: 60,
              position: "absolute",
              bottom: 0,

              left: 0,
              right: 0,
            }}
          >
            {specInfo}
          </Box>
        </Box>
      </Box>
      <ConfirmationDialog
        open={openDelConfirmation}
        onCancel={setOpenDelConfirmation}
        title="Delete"
        content="Are you sure you want to delete this article spec?"
        onConfirm={handleDelete}
        btnColor={"error"}
      />
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showInfo}
      >
        <Box
          component={"div"}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 1,
          }}
        >
          <Box display={"flex"} justifyContent={"flex-end"}>
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            </IconButton>
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            </IconButton>
            <IconButton onClick={() => setShowInfo(false)}>
              <Close sx={{ color: (theme) => theme.palette.common.white }} />
            </IconButton>
          </Box>

          <Box
            component={"div"}
            sx={{
              width: "400px",
              height: "300px",
              overflow: "auto",
              border: "1px solid black",
              margin: "auto",
            }}
          >
            <img
              src={specUrl}
              alt="Display"
              style={{
                width: 400,
                height: 300,
                transform: `scale(${scale})`,
                transition: "transform 0.2s ease",

                transformOrigin: "center",
              }}
            />
          </Box>
        </Box>
      </Backdrop>
    </>
  );
}

export default ArticleSpecCard2;
