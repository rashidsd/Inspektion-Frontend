import { useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import dayjs from "dayjs";

function toInputValue(value: any, inputType: "text" | "date") {
  if (inputType === "date") {
    const d = dayjs(value);
    return d.isValid() ? d.format("YYYY-MM-DD") : "";
  }
  return value ?? "";
}

function InlineEditCell({
  value,
  inputType = "text",
  onSave,
  getUpdateList,
  successMessage,
  onSuccess,
  onError,
}: {
  value: any;
  inputType?: "text" | "date";
  onSave: (newValue: string) => Promise<any>;
  getUpdateList: () => void;
  successMessage?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const [val, setVal] = useState(toInputValue(value, inputType));
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit) inputRef.current?.focus();
  }, [isEdit]);

  const displayValue =
    inputType === "date"
      ? dayjs(value).isValid() ? dayjs(value).format("DD-MM-YY") : ""
      : value ?? "";

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await onSave(val);
      if (response?.status) {
        setIsEdit(false);
        getUpdateList();
        onSuccess?.(successMessage || "Updated successfully");
      } else {
        onError?.(response?.msg || "Update failed");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      onError?.("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component={"div"} sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {isEdit ? (
        <input
          type={inputType}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          ref={inputRef}
          style={{ flex: 1, minWidth: 0, height: "25px", fontSize: "0.7rem", padding: "4px" }}
        />
      ) : (
        <span>{displayValue}</span>
      )}
      {isEdit ? (
        <IconButton color="success" size="small" disabled={saving} onClick={handleSave} sx={{ flexShrink: 0 }}>
          <DoneIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      ) : (
        <IconButton color="primary" size="small" onClick={() => setIsEdit(true)} sx={{ flexShrink: 0 }}>
          <EditIcon sx={{ fontSize: "15px" }} />
        </IconButton>
      )}
    </Box>
  );
}

export default InlineEditCell;
