import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Pica from "pica";
import { addInspectionPicture } from "../services/inspection/inspection_picture_Service";
import { useFinalInspectionStore } from "../store/final_inspection_store";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CameraIcon from "@mui/icons-material/Camera";
import SaveIcon from "@mui/icons-material/Save";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const TakePicture = ({
  params,
}: {
  params: {
    onClose?: (arg: boolean) => void;
    inspection_no?: string;
    order_no: string | null;
    article?: string;
    color?: string;
    customer_order_no?: string;
    isClose?: boolean;
  };
}) => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const [img, setImg] = useState<any | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [imageSize, setImageSize] = useState<string>("small");
  const remarksRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const { updateOrderImagesTotal, updateArticleImagesTotal } =
    useFinalInspectionStore((state) => state);

  const { inspection_no, order_no, article, color, customer_order_no } = params;

  const getStream = () => {
    const constraints = {
      video: { facingMode: { exact: "environment" } }, // Rear camera
      //video: { facingMode: { exact: "user" } }, // Front camera
      //video: true, // Default camera (webcam)
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
      });
  };

  const disposeStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track: any) => track.stop());
    }
  };

  useEffect(() => {
    getStream();
    return () => {
      disposeStream();
    };
  }, [params.isClose]);

  const handleClose = () => {
    params.onClose && params.onClose(false);
    setResizedImage(null);
    setRemarks("");
  };

  const captureAndResizeImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const pica = new Pica();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // canvas.width = 640; // Desired width for capture
    // canvas.height = 480; // Desired height for capture
    canvas.width = 1280; // Desired width for capture
    canvas.height = 960; // Desired height for capture

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const resizedCanvas = document.createElement("canvas");
    if (imageSize === "large") {
      resizedCanvas.width = 1280;
      resizedCanvas.height = 960;
    } else if (imageSize === "medium") {
      resizedCanvas.width = 640;
      resizedCanvas.height = 480;
    } else {
      resizedCanvas.width = 320;
      resizedCanvas.height = 240;
    }

    try {
      await pica.resize(canvas, resizedCanvas);
      resizedCanvas.toBlob((blob: any) => {
        const url = URL.createObjectURL(blob);
        setImg(blob); // raw image to save
        setResizedImage(url);
      }, "image/jpeg");
      remarksRef.current.focus();
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  const handleCancel = () => {
    setResizedImage(null);
    getStream();
    setRemarks("");
  };

  const handleSavePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("file", img);

      formData.append(
        "data",
        JSON.stringify({
          inspection_no,
          order_no,
          article,
          color,
          customer_order_no,
          remarks,
          recordType: article == null ? "order" : "article",
          priority: 1,
          image_size: imageSize,
        })
      );
      const response: any =
        article == null
          ? await addInspectionPicture(formData, "order")
          : await addInspectionPicture(formData, "article");

      if (response.data) {
        setAlert({
          open: true,
          message: "image uploaded successfully",
          serverity: "success",
        });
        if (article == null) {
          updateOrderImagesTotal(response.data.count);
        } else {
          updateArticleImagesTotal(response.data.count);
        }
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        bgcolor: "rgba(200,200,200,0.9)",

        boxShadow: "1px 1px 3px 3px ",
        p: 2,
      }}
    >
      <Typography textAlign={"start"} variant="body2" align="center">
        {`${params.article ? "Article : " + params.article : ""}`}
      </Typography>

      {resizedImage ? (
        <img
          src={resizedImage}
          alt="Resized"
          width={350}
          style={{ maxWidth: "100%" }}
        />
      ) : (
        videoRef && (
          <>
            <video ref={videoRef} autoPlay style={{ maxWidth: "100%" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        )
      )}
      <TextField
        name="remarks"
        value={remarks}
        onChange={(e: any) => setRemarks(e.target.value)}
        sx={{ py: 1 }}
        multiline
        label={"Remarks"}
        fullWidth
        inputRef={remarksRef}
        size="small"
      />
      <Select
        displayEmpty={true}
        name="image_size"
        fullWidth
        value={imageSize}
        onChange={(e) => setImageSize(e.target.value)}
        size="small"
        sx={{ mb: 1 }}
      >
        <MenuItem value={"small"}>Small</MenuItem>
        <MenuItem value={"medium"}>Medium</MenuItem>
        <MenuItem value={"large"}>Large</MenuItem>
      </Select>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          "& .MuiSvgIcon-root": { fontSize: 30 },
        }}
      >
        <Tooltip title="Capture Image" placement="bottom">
          <IconButton
            size="small"
            color="warning"
            onClick={captureAndResizeImage}
          >
            <CameraIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Save Image" placement="bottom">
          <IconButton size="small" color="success" onClick={handleSavePicture}>
            <SaveIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cancel" placement="bottom">
          <IconButton size="small" color="secondary" onClick={handleCancel}>
            <DoNotDisturbIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Close" placement="bottom">
          <IconButton size="small" color="error" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TakePicture;
