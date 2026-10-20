import  React,{useState,useEffect, use} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useExportDocuments } from '../hooks/useExportDocuments';
import { downloadFile, getExportDocumentUrl } from '../util/globals';
import  IconButton  from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Box from '@mui/material/Box';  
import ConfirmationDialog from './ConfirmationDialog';
import CircularProgress  from '@mui/material/CircularProgress';
import { getTableHeaderBg } from '../util/tableStyles';



export default function ExportDocumentDetail() {
    const { getList, removeDocument,currList } = useExportDocuments();
    const [list , setList] = useState(currList ?? []);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<{} | null>(null);
    const [loading, setLoading] = useState(false);
 

const handleDelete= async() => {
 try {
  if(selectedRecord){
    setLoading(true);
    await removeDocument((selectedRecord as any).id);
    await getList((selectedRecord as any).shipping_no);
    setSelectedRecord(null);
    
  }
 } catch (error) {
  console.error("Error deleting document:", error);
 }finally {
  setOpenConfirm(false);
  setLoading(false);
 }
};


  return (
    <>
    <TableContainer component={Paper}>
      <Table  aria-label="Export Detail" size='small'>
        <TableHead sx={{ backgroundColor: (theme) => getTableHeaderBg(theme) }}>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>File Type</TableCell>
            <TableCell>Action</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {currList && currList.map((row) => (
            <TableRow
              key={row.descr}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.descr}
              </TableCell>
              <TableCell  >{row.file_extension}</TableCell>
              <TableCell 
              size='small' 
              sx={{p:0}}
              >
                <Box   component={"div"} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1}>
                  <Box component={"span"}
                   onClick={() => {
                     const url = getExportDocumentUrl(row.stored_path);
                     if (!url) return;
                     void downloadFile(
                       url,
                       `${row.shipping_no || "document"}.${row.file_extension || "bin"}`
                     );
                   }}
                  sx={{":hover":{cursor:'pointer',textDecoration:"underline"}}}
                  >Download</Box>
                
                <IconButton 
                sx={{display:'flex',alignItems:'center',justifyContent:'center'}}
                 onClick={async() => {
                  setSelectedRecord(row);
                  setOpenConfirm(true);
                 }}
                color="error" aria-label="delete">
                  <DeleteForeverIcon />
                 
                </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <ConfirmationDialog
        open={openConfirm}
        title={"Deletion"}
        content={"sure to delete ?"}
        onCancel={setOpenConfirm}
        onConfirm={handleDelete}
        btnColor={"error"}
      />
    </>
  );
}
