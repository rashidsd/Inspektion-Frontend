import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { settings } from "../apiSettings.js";

export const ExportToExcel = (
  data: any[],
  sheetName: string,
  excludeColumns?: any[],
  dateFormatCols?: string[]
) => {
  const newData = data.map((item) => {
    const newItem: any = { ...item };
    if (excludeColumns) {
      excludeColumns.forEach((col) => {
        delete newItem[col];
      });
    }
    if (dateFormatCols) {
      dateFormatCols.forEach((col) => {
        if (newItem[col]) {
          newItem[col] = dayjs(newItem[col]).format("DD-MMM-YY");
        }
      });
    }
    return newItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(newData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return blob;
};


/** Build absolute URL for an export document stored_path from the API. */
export function getExportDocumentUrl(storedPath?: string | null): string {
  if (!storedPath) return "";
  if (/^https?:\/\//i.test(storedPath)) return storedPath;

  const normalized = storedPath.replace(/\\/g, "/");
  const pathPart = normalized.startsWith("/") ? normalized : `/${normalized}`;

  // settings.baseURL has no trailing slash (e.g. http://localhost:4000)
  return `${settings.baseURL}${pathPart}`;
}

export async function downloadFile(url: string, filename?: string) {
  const response = await fetch(url, { mode: "cors", credentials: "omit" });
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename || url.split("/").pop() || "download";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

