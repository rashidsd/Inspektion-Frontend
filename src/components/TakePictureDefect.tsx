import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Pica from "pica";
import { addInspectionPicture } from "../services/inspection/inspection_picture_Service";
import { useFinalInspectionStore } from "../store/final_inspection_store";
import CameraIcon from "@mui/icons-material/Camera";
import SaveIcon from "@mui/icons-material/Save";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const TakePictureDefect = ({
  params,
  onClose,
  saveAnalysis,
}: {
  params: any;
  onClose(val: boolean): void;
  saveAnalysis(): Promise<void>;
}) => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const [img, setImg] = useState<any | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const remarksRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const { updateOrderImagesTotal, updateArticleImagesTotal } =
    useFinalInspectionStore((state) => state);

  const { inspection_no, order_no, article, color, showAnalysis, detail } =
    params;

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
  }, [showAnalysis]);

  //   const handleClose = () => {
  //     params.onClose && params.onClose(false);
  //     setResizedImage(null);
  //     setRemarks("");
  //   };

  const captureAndResizeImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const pica = new Pica();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 1280; // Desired width for capture
    canvas.height = 960; // Desired height for capture

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = 640; // Resized width
    resizedCanvas.height = 480; // Resized height

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
          customer_order_no: "",
          remarks: detail,
          recordType: article == null ? "order" : "article",
          priority: 2,
          image_size: "small",
        })
      );
      const response: any =
        article == null
          ? await addInspectionPicture(formData, "order")
          : await addInspectionPicture(formData, "article");

      if (response.data) {
        await saveAnalysis();
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
    <Box>
      {resizedImage ? (
        <img src={resizedImage} alt="Resized" width={300} />
      ) : (
        videoRef && (
          <>
            <video ref={videoRef} autoPlay style={{ maxWidth: 300 }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        )
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          "& .MuiSvgIcon-root": { fontSize: 30 },
          width: 300,
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
          <IconButton size="small" color="error" onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TakePictureDefect;
