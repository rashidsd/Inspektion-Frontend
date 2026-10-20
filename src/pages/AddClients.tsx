import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import ContactList from "../components/ContactList";
import ERPSnakBar from "../components/ERPSnakBar";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InputFileUpload from "../components/InputFileUpload";
import ERPGrid from "../components/ERPGrid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { AgGridReact } from "ag-grid-react";
import {
  getClientById,
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientService";
import {
  BrandType,
  ClientVendorType,
  ContactType,
} from "../customTypes/customTypes";
import BrandList from "../components/BrandList";
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

function AddClients() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState("");
  const [allClients, setAllClients] = useState([]);
  const contactPersonRef = useRef<HTMLInputElement>(null);
  const clientIdRef = useRef<HTMLInputElement>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [loadList, setLoadList] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const [client, setClient] = useState<ClientVendorType>({
    id: "",
    name: "",
    company: "",
    web: "",
    address: "",

    file_name: "",
    contacts: [],
    brands: [],
  });

  const [contact, setContact] = useState<ContactType>({
    id: "",
    client_id: "",
    contact_person: "",
    contact_no: "",
    designation: "",
    email: "",
  });

  const [brand, setBrand] = useState<BrandType>({
    id: "",
    client_id: "",
    name: "",
    descr: "",
  });

  const clientColDef = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      cellClass: "client-id",
      cellRenderer: (param: any) => (
        <Box component="div" onClick={() => handleClientInfo(param.data.id)}>
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
      headerName: "Photo",
      cellRenderer: (param: any) => (
        <img src={param.data.url} alt="photo" height={40} width={40} />
      ),
    },
    { field: "address", flex: 1, minWidth: 130 },
  ];

  const handleClientInfo = (clientId: string) => {
    setValue(0);
    clientById(clientId);
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
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  async function clientById(clientId: string) {
    try {
      const response = await getClientById(clientId);
      if (response.status) {
        setClient({
          ...response.data,
          contacts: [...response.data.contacts],
          brands: [...response.data.brands],
        });
        setImageUrl(response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadClients() {
    try {
      setLoadList(true);
      const response: any = await getAllClients();
      if (response.status) {
        setAllClients(response.data);
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
    } finally {
      setLoadList(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddContact = () => {
    setClient({
      ...client,
      contacts: [...client.contacts!, contact],
    });
  };
  const handleAddBrand = () => {
    setClient({
      ...client,
      brands: [...client.brands!, brand],
    });

    setContact({
      id: "",
      client_id: "",
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
      client_id: client.id,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeBrand = (e: any) => {
    setBrand({
      ...brand,
      client_id: client.id,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNew = () => {
    setClient({
      id: "",
      name: "",
      company: "",
      web: "",
      address: "",
      file_name: "",
      contacts: [],
      brands: [],
    });
    setContact({
      id: "",
      client_id: "",
      contact_person: "",
      contact_no: "",
      designation: "",
      email: "",
    });
    setBrand({
      id: "",
      client_id: "",
      name: "",
      descr: "",
    });
    setFile(null);
    setImageUrl("");

    clientIdRef.current?.focus();
  };

  const saveClient = async () => {
    try {
      client.contacts?.forEach((c) => {
        if (!c.id) {
          delete c.id;
        }
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(client));

      const response: any =
        client.id == undefined || client.id == ""
          ? await createClient(formData)
          : await updateClient(formData);

      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          serverity: "success",
        });
        clientById(response.data.id);
        loadClients();
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
      const response: any = await deleteClient(client.id);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          serverity: "success",
        });
        loadClients();
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
          Manage Clients
        </Typography>

        <Tabs value={value} onChange={handTabChange}>
          <Tab label="Add Client" value={0} />
          <Tab label="Client List" value={1} />
        </Tabs>
        <TabPanel value={value} index={0} key={0}>
          <Box width={450} sx={{ mt: 3, p: 2 }}>
            <Button onClick={handleAddNew} sx={{ mb: 2 }} variant="outlined">
              New Client
            </Button>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack spacing={2} sx={{ flexGrow: 1, pr: 1 }}>
                <TextField
                  name="id"
                  size="small"
                  label="Id"
                  fullWidth
                  variant="outlined"
                  value={client.id}
                  inputRef={clientIdRef}
                />
                <TextField
                  name="name"
                  size="small"
                  label="name"
                  fullWidth
                  variant="outlined"
                  value={client.name}
                  onChange={handleValueChange}
                />
                <TextField
                  name="company"
                  size="small"
                  label="company"
                  fullWidth
                  variant="outlined"
                  value={client.company}
                  onChange={handleValueChange}
                />
                <TextField
                  name="web"
                  size="small"
                  label="web"
                  fullWidth
                  variant="outlined"
                  value={client.web}
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
                    btnColor={"success"}
                  />
                  <Button
                    onClick={() => {
                      setFile("null");
                      setImageUrl("");
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
              name="address"
              sx={{ mt: 2 }}
              size="small"
              label="Address"
              fullWidth
              variant="outlined"
              value={client.address}
              onChange={handleValueChange}
            />
          </Box>
          <Box sx={{ py: 2, pr: 2 }}>
            <Box
              sx={{
                flexGrow: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 2,
              }}
            >
              <Grid spacing={1} container>
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
                sx={{ mt: 1, mb: 2 }}
                variant="outlined"
                color="primary"
              >
                Add Contact
              </Button>
              <ContactList client={client} handleClient={setClient} />
            </Box>

            <Box
              sx={{
                mt: 2,
                flexGrow: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 2,
              }}
            >
              <Grid container spacing={1} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="name"
                    label="Brand Name"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={brand.name}
                    onChange={handleChangeBrand}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    name="descr"
                    label="Description"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={brand.descr}
                    onChange={handleChangeBrand}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    onClick={handleAddBrand}
                    sx={{ mb: { sm: 2, md: 0 } }}
                    variant="outlined"
                  >
                    Add Brand
                  </Button>
                </Grid>
              </Grid>
              <Box component={"div"} sx={{ mt: { sm: 0, md: 1 } }}>
                <BrandList client={client} handleClient={setClient} />
              </Box>
            </Box>

            <Box
              sx={{ mt: 1 }}
              display={"flex"}
              justifyContent={"flex-start"}
              gap={1}
            >
              <Button
                onClick={saveClient}
                sx={{ width: 100 }}
                variant="outlined"
              >
                {client.id == "" || client.id == null ? "Save" : "Update"}
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
              "& .client-id:hover": {
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
              rowData={allClients}
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
        open={openDeleteConfirmation}
        onCancel={setOpenDeleteConfirmation}
        onConfirm={handleDeleteClient}
        btnColor={"error"}
      />
      <Backdrop open={loadList} sx={{ zIndex: 1000 }}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
}

export default AddClients;
