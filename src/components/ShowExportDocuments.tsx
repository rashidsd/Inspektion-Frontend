// ShipmentDocuments.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import exportDocumentService from "../services/exportDocumentService";
import dayjs from "dayjs";
import { downloadFile, getExportDocumentUrl } from "../util/globals";

type ShipmentDocument = {
  id: number | string;
  shipping_no: string;
  stored_path: string;
  file_extension: string;
  descr?: string;
};

type Props = {
  shipNo: string;
  closeDialog: (val: boolean) => void;
};

function getFileType(ext: string): "image" | "pdf" | "excel" | "other" {
  const e = (ext || "").toLowerCase().replace(/^\./, "");

  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(e)) return "image";
  if (e === "pdf") return "pdf";
  if (["xls", "xlsx", "csv", "xlsm"].includes(e)) return "excel";

  return "other";
}

function FileTypePreview({
  fileType,
  ext,
  src,
  alt,
}: {
  fileType: "image" | "pdf" | "excel" | "other";
  ext: string;
  src: string;
  alt: string;
}) {
  if (fileType === "image") {
    return (
      <Box
        sx={{
          height: "70%",
          width: "100%",
          bgcolor: "grey.200",
          borderBottom: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <Box
          sx={{
            display: "none",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <ImageIcon fontSize="large" color="action" />
          <Typography variant="caption" color="text.secondary">
            {(ext || "IMG").toUpperCase()}
          </Typography>
        </Box>
      </Box>
    );
  }

  const icon =
    fileType === "pdf" ? (
      <PictureAsPdfIcon sx={{ fontSize: 48, color: "error.main" }} />
    ) : fileType === "excel" ? (
      <TableChartIcon sx={{ fontSize: 48, color: "success.main" }} />
    ) : (
      <InsertDriveFileIcon sx={{ fontSize: 48, color: "info.main" }} />
    );

  const label =
    fileType === "pdf"
      ? "PDF"
      : fileType === "excel"
        ? "EXCEL"
        : (ext || "FILE").toUpperCase();

  return (
    <Box
      sx={{
        height: "70%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0.5,
        bgcolor: "grey.100",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      {icon}
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {label}
      </Typography>
    </Box>
  );
}

export default function ShipmentDocuments({ shipNo, closeDialog }: Props) {
  const [list, setList] = useState<ShipmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(
    null
  );

  const getDocuments = async () => {
    if (!shipNo?.trim()) {
      setLoading(false);
      setList([]);
      return;
    }
    try {
      setLoading(true);
      const response = await exportDocumentService.getDocumentsByShippingNo(
        shipNo
      );
      setList(response.data ?? []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [shipNo]);

  const handleDownload = async (doc: ShipmentDocument) => {
    const ext = (doc.file_extension || "").replace(/^\./, "");
    const filename = `${doc.shipping_no}_${dayjs().format("YYYYMMDD")}.${ext}`;
    const url = getExportDocumentUrl(doc.stored_path);

    try {
      setDownloadingId(doc.id);
      await downloadFile(url, filename);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open file in a new tab if blob download fails
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          minWidth: 280,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography color="text.primary">Loading documents…</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        maxHeight: 595,
        maxWidth: 700,
        overflowY: "auto",
        bgcolor: "background.paper",
        color: "text.primary",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 1,
          mb: 2,
          textAlign: "center",
          borderRadius: 1,
        }}
      >
        Export Documents for Shipment: {shipNo}
      </Typography>

      <Box sx={{ width: 550, maxWidth: "100%" }} display="flex" gap={2} flexWrap="wrap">
        {list.map((doc) => {
          const fileType = getFileType(doc.file_extension);
          const fileUrl = getExportDocumentUrl(doc.stored_path);

          return (
            <Box
              key={doc.id}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Card
                sx={{
                  width: 170,
                  height: 230,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  boxShadow: 2,
                }}
              >
                <FileTypePreview
                  fileType={fileType}
                  ext={doc.file_extension}
                  src={fileUrl}
                  alt={doc.shipping_no}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 12,
                    px: 1,
                    pt: 0.5,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={doc.descr}
                >
                  {doc.descr || "—"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 0.5,
                    p: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    disabled={downloadingId === doc.id}
                    sx={{ textTransform: "none" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                  >
                    {downloadingId === doc.id ? "…" : "Download"}
                  </Button>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>

      {list.length === 0 && (
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ fontSize: 16, px: 1, color: "text.secondary" }}
        >
          No document uploaded
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => closeDialog(false)}
        >
          Close
        </Button>
      </Box>
    </Paper>
  );
}
