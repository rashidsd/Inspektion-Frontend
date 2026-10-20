import { useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { stripedRowSx, tableHeaderRowSx } from "../util/tableStyles";

function ShippingDetail({ list }: { list: any[] }) {
  const shippingRef = useRef<any>(null);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Shipping Detail" size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowSx}>
              <TableCell sx={{ py: 1 }}>Article Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shiped_Qty</TableCell>
              <TableCell>Bal</TableCell>
              <TableCell>Shipping</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list.length > 0 &&
              list.map((article, index) => (
                <TableRow key={index} sx={stripedRowSx(index)}>
                  <TableCell>{article?.art_name}</TableCell>
                  <TableCell>{article?.color}</TableCell>
                  <TableCell>{article?.size}</TableCell>
                  <TableCell>{article?.barcode}</TableCell>
                  <TableCell>{article?.qty}</TableCell>
                  <TableCell>{article?.price}</TableCell>
                  <TableCell>{article?.ship_qty}</TableCell>
                  <TableCell>{article?.bal}</TableCell>
                  <TableCell>
                    <TextField
                      inputRef={shippingRef}
                      sx={{ width: "100px", fontWeight: 500 }}
                      name="shipping"
                      size="small"
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          if (Number(e.target.value) > article.bal)
                            e.target.value = "0";
                          article.shipping = e.target.value;
                        } else {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ShippingDetail;
