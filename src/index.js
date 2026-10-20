import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ExportDocumentsProvider } from "./hooks/useExportDocuments";
import { ThemeProvider } from "./theme/ThemeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ExportDocumentsProvider>
        <RouterProvider router={router} />
      </ExportDocumentsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
