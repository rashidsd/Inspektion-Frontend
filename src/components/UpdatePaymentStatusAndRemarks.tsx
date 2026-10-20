import {useEffect,useState,useRef} from "react"
import { IconButton } from "@mui/material"
import Box from "@mui/material/Box"
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import dayjs from "dayjs";
import ERPSnakBar from "./ERPSnakBar";
import { updatePaymentStatusAndRemarks } from "../services/shipDataService";

function UpdatePaymentStatusAndRemarks({fieldName,cellValue,keyValue,inputType="text",getUpdateList}:{fieldName:string,cellValue:any,keyValue:string,inputType?:"text"|"date",getUpdateList:React.Dispatch<React.SetStateAction<void>>}) {

    const toInputValue = (v:any) =>
      inputType === "date" ? (dayjs(v).isValid() ? dayjs(v).format("YYYY-MM-DD") : "") : (v ?? "");

    const [value,setValue]=useState<any>(toInputValue(cellValue))
    const [IsEdit,setIsEdit]=useState(false)
    const [saving,setSaving]=useState(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

    useEffect(() => {
      if (IsEdit) inputRef.current?.focus();
    }, [IsEdit]);

    const displayValue =
      inputType === "date" ? (dayjs(cellValue).isValid() ? dayjs(cellValue).format("DD-MM-YY") : "") : (cellValue ?? "");

    const handleUpdate = async ()=> {
        setSaving(true);
        try {
          const response = await updatePaymentStatusAndRemarks(fieldName, value,keyValue);
          if (response.status) {
            setIsEdit(false);
            getUpdateList();
            setAlert({
              open: true,
              message: "updated successfully",
              serverity: "success",
            });
          } else {
            setAlert({
              open: true,
              message: response.msg || "update failed",
              serverity: "error",
            });
          }
        } catch (error) {
          console.error("Error updating remarks:", error);
          setAlert({
            open: true,
            message: "update failed",
            serverity: "error",
          });
        } finally {
          setSaving(false);
        }
    }
  return (
    <Box component={"div"} sx={{display:"flex",alignItems:"center" }}>
      {IsEdit ? (
        <input
          type={inputType}
          value={value}
          onChange={(e) => { setValue(e.target.value) }}
            ref={inputRef}
          style={{ flex: 1, minWidth: 0, height: "25px", fontSize: "0.7rem",padding:"4px" }}
        />
      ) : (
        <span>{displayValue}</span>
      )}
      {IsEdit ? (
        <IconButton
          color="success"
          size="small"
          disabled={saving}
          onClick={handleUpdate}
          sx={{ flexShrink: 0 }}
        >
          <DoneIcon sx={{fontSize:"18px"}} />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          size="small"
          onClick={() => setIsEdit(true)}
          sx={{ flexShrink: 0 }}
        >
          <EditIcon sx={{fontSize:"15px"}}/>
        </IconButton>
      )}
      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.serverity}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
      />
    </Box>
  )
}

export default UpdatePaymentStatusAndRemarks
