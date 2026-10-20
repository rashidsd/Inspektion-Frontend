import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import ContactListVendor from "../components/ContactListVendor";
import ERPSnakBar from "../components/ERPSnakBar";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InputFileUpload from "../components/InputFileUpload";
import ERPGrid from "../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import {
  getVendorById,
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../services/vendorService";
import {
  ClientVendorType,
  ContactTypeVendor,
} from "../customTypes/customTypes";
import { util } from "../util";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return value === index && <Box {...other}>{children}</Box>;
}

const paymentTerms: string[] = [
  "25% T/T Deposit / 75% Balance Telex released upon arrival",
  "90 DAYS FACTORING BL",
  "Net 60 on BL",
  "90 DAYS FACTORING BL",
  "Net 15 on BL",
  "Net 30 on BL",
  "Net 40 on BL",
  "Net 45 on BL",
  "Net 60 on BL",
  "Net 90 on BL",
  "20% DEPOSIT/80% BL",
]

function AddVendors() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [allVendors, setAllVendors] = useState([]);
  const contactPersonRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const [vendor, setVendor] = useState<ClientVendorType>({
    id: "",
    name: "",
    company: "",
    web: "",
    address: "",
    source: "",
    payment_terms: "",
    payment_days: 0,
    file_name: "",
    contacts: [],
  });

  const [contact, setContact] = useState<ContactTypeVendor>({
    id: "",
    vendor_id: "",
    contact_person: "",
    contact_no: "",
    designation: "",
    email: "",
  });

  const clientColDef = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      cellClass: "vendor-id",
      cellRenderer: (param: any) => (
        <Box component="div" onClick={() => handleVendorInfo(param.data.id)}>
          {param.data.id}
        </Box>
      ),
    },
    { field: "name", width: 180 },
    { field: "company", width: 140 },
    { field: "web", width: 150 },

    {
      field: "url",
      width: 150,
      headerName: "photo",
      cellRenderer: (param: any) => (
        <img src={param.data.url} alt="photo" height={40} width={40} />
      ),
    },
    { field: "address", flex: 1, minwidth: 120 },
  ];

  const handleVendorInfo = (vendorId: string) => {
    setValue(0);
    vendorById(vendorId);
  };

  const handTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleFileChange = (e: any) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFile(e.target.files[0]);
    
  };

  const handleValueChange = (e: any) => {
    setVendor({ ...vendor, [e.target.name]: e.target.name==="payment_days" ? Number(e.target.value) : e.target.value });
  };

  async function vendorById(vendorId: string) {
    try {
      const response = await getVendorById(vendorId);
      if (response.status) {
        setVendor({
          ...response.data,
          contacts: [...response.data.contacts],
        });
        setImageUrl(response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadVendors() {
    try {
      const response: any = await getAllVendors();
      if (response.status) {
        setAllVendors(response.data);
      }
    } catch (error: any) {
      setAlert({
        open: true,
        message:
          error?.response?.length > 0
            ? error.response.data.msg
            : error.message.toString(),
        serverity: "error",
      });
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  const handleAddContact = () => {
    setVendor({
      ...vendor,
      contacts: [...vendor.contacts!, contact],
    });

    setContact({
      id: "",
      vendor_id: "",
      contact_person: "",
      contact_no: "",
      designation: "",
      email: "",
    });
    contactPersonRef.current?.focus();
  };

  const handleChangeContact = (e: any) => {
    setContact({
      ...contact,
      vendor_id: vendor.id,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNew = () => {
    setVendor({
      id: "",
      name: "",
      company: "",
      web: "",
      address: "",
      file_name: "",
      contacts: [],
    });
    setFile(null);
    setImageUrl(undefined);
    nameRef.current?.focus();
  };

  const saveVendor = async () => {
    try {
      vendor.contacts?.forEach((c) => {
        if (!c.id) {
          delete c.id;
        }
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(vendor));

      const response: any =
        vendor.id == undefined || vendor.id == ""
          ? await createVendor(formData)
          : await updateVendor(formData);

      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          serverity: "success",
        });
        vendorById(response.data.id);
        loadVendors();
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

  const handleDeleteClient = async () => {
    try {
      setOpenDeleteConfirmation(false);
      const response: any = await deleteVendor(vendor.id);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          serverity: "success",
        });
        loadVendors();
        handleAddNew();
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
    <>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <Typography variant="h4" color="primary">
          Manage Vendors
        </Typography>

        <Tabs value={value} onChange={handTabChange}>
          <Tab label="Add Vendor" value={0} />
          <Tab label="Vendor List" value={1} />
        </Tabs>
        <TabPanel value={value} index={0} key={0}>
          <Box width={450} sx={{ mt: 3, p: 2 }}>
            <Button sx={{ mb: 2 }} onClick={handleAddNew} variant="outlined">
              Add Vendor
            </Button>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack spacing={2} sx={{ flexGrow: 1, pr: 1 }}>
                <TextField
                  name="id"
                  size="small"
                  label="Id"
                  fullWidth
                  variant="outlined"
                  value={vendor.id}
                  disabled
                />
                <TextField
                  name="name"
                  size="small"
                  label="name"
                  fullWidth
                  variant="outlined"
                  value={vendor.name}
                  onChange={handleValueChange}
                  inputRef={nameRef}
                />
                <TextField
                  name="company"
                  size="small"
                  label="company"
                  fullWidth
                  variant="outlined"
                  value={vendor.company}
                  onChange={handleValueChange}
                />
                <TextField
                  name="web"
                  size="small"
                  label="web"
                  fullWidth
                  variant="outlined"
                  value={vendor.web}
                  onChange={handleValueChange}
                />
              </Stack>

              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                direction={"column"}
                spacing={1}
              >
                <img
                  src={imageUrl}
                  alt="image"
                  height={150}
                  width={150}
                  style={{ border: "1px solid rgba(0,0,0,0.04)" }}
                />
                <Stack direction={"row"} spacing={1}>
                  <InputFileUpload
                    size={"small"}
                    isIcon={false}
                    lable="Upload"
                    fileChange={handleFileChange}
                    btnColor="success"
                  />
                  <Button
                    onClick={() => {
                      setFile(undefined);
                      setImageUrl(undefined);
                    }}
                    size="small"
                    variant="outlined"
                    color="error"
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            </Box>
            <TextField
              name="source"
              sx={{ mt: 2 }}
              size="small"
              label="Source"
              fullWidth
              variant="outlined"
              value={vendor.source}
              onChange={handleValueChange}
            />
            <TextField
              name="payment_days"
              sx={{ mt: 2 }}
              size="small"
              label="Payment Days"
              fullWidth
              variant="outlined"
              value={vendor.payment_days}
              onChange={handleValueChange}
              type="number"
            />
            
            <Autocomplete 
              sx={{ mt: 2 }}
            size="small"
              options={paymentTerms}
              value={vendor.payment_terms || null}
              onChange={(event: any, newValue: string | null) => {
                setVendor({ ...vendor, payment_terms: newValue || "" });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Payment Terms" variant="outlined" />
              )}
            />
            <TextField
              name="address"
              sx={{ mt: 2 }}
              size="small"
              label="Address"
              fullWidth
              variant="outlined"
              value={vendor.address}
              onChange={handleValueChange}
            />
          </Box>
          <Box sx={{ mt: 3, p: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid spacing={2} container>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="contact_person"
                    size="small"
                    label="Contact Person"
                    fullWidth
                    variant="outlined"
                    value={contact.contact_person}
                    onChange={handleChangeContact}
                    inputRef={contactPersonRef}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="designation"
                    size="small"
                    label="Designation"
                    fullWidth
                    variant="outlined"
                    value={contact.designation}
                    onChange={handleChangeContact}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="contact_no"
                    size="small"
                    label="Contact  Number"
                    fullWidth
                    variant="outlined"
                    value={contact.contact_no}
                    onChange={handleChangeContact}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="email"
                    size="small"
                    label="EMail"
                    fullWidth
                    variant="outlined"
                    value={contact.email}
                    onChange={handleChangeContact}
                    sx={{ mr: 0.5 }}
                  />
                </Grid>
              </Grid>
              <Button
                onClick={handleAddContact}
                sx={{ my: 2 }}
                variant="outlined"
                color="primary"
              >
                Add Contact
              </Button>
            </Box>
            <ContactListVendor vendor={vendor} handleVendor={setVendor} />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              ml: 2,
              mb: 2,
            }}
          >
            <Button onClick={saveVendor} sx={{ width: 100 }} variant="outlined">
              {vendor.id == "" || vendor.id == null ? "Save" : "Update"}
            </Button>
            <Button
              onClick={() => setOpenDeleteConfirmation(true)}
              sx={{ width: 100 }}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} key={1}>
          <Box
            sx={{
              width: {
                xs: `calc(100vw - ${util.erpGridMarginX}px)`,
                lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
              },
              mt: 2,
              "& .vendor-id:hover": {
                textDecoration: "underline",
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <ERPGrid
              ref={gridRef}
              gridHeight={"70vh"}
              exportToExcel={true}
              columnDefs={clientColDef}
              rowData={allVendors}
            />
          </Box>
        </TabPanel>
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />
      <ConfirmationDialog
        title="Delete Vendor"
        open={openDeleteConfirmation}
        onCancel={setOpenDeleteConfirmation}
        onConfirm={handleDeleteClient}
        btnColor={"error"}
      />
      {/* <Backdrop open={loadList} sx={{ zIndex: 1000 }}>
        <CircularProgress color="primary" />
      </Backdrop> */}
    </>
  );
}

export default AddVendors;
