import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid2";
import { getClientForSelection } from "../services/clientService";
import { getCategoriesForSelection } from "../services/categoryService";
import { brandByClient } from "../services/clientService";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState, useRef } from "react";
import { ParentArticleType } from "../customTypes/customTypes";
import ERPSnakBar from "../components/ERPSnakBar";
import { ColDef } from "ag-grid-community";
import ERPGrid from "../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  addArticle,
  getParentArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../services/parent_articleService";

import { util } from "../util";
import { Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return value === index && <Box {...other}>{children}</Box>;
}

function AddParentArticle() {
  const [clients, setClients] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [article, setArticle] = useState<ParentArticleType | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const clientRef = useRef<HTMLInputElement>(null);
  const GridRef = useRef<AgGridReact>(null);

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      cellClass: "article-id",
      width: 100,
      filter: true,
      onCellClicked: (param) => {
        handleArticleById(param.data.id);
      },
    },
    {
      field: "client",
      headerName: "Client",
      width: 170,
      filter: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 170,
      filter: true,
    },
    {
      field: "art_name",
      headerName: "Atricle Name",
      filter: true,
    },
    {
      field: "hero",
      headerName: "Hero",
      filter: true,
      width: 100,
    },

    {
      field: "uom",
      headerName: "UOM",
      width: 90,
    },

    {
      field: "category",
      headerName: "Category",
      minWidth: 130,
      flex: 1,
      filter: true,
    },
  ];

  const allArticles = async () => {
    const response: any = await getParentArticles();
    setArticles(response.data);
  };
  useEffect(() => {
    allArticles();
  }, []);

  useEffect(() => {
    const allClients = async () => {
      const response: any = await getClientForSelection();
      setClients(response.data);
    };
    allClients();
  }, []);

  useEffect(() => {
    const allCategories = async () => {
      const response: any = await getCategoriesForSelection();
      setCategories(response.data);
    };
    allCategories();
  }, []);

  const handleChangeClient = async (value: any) => {
    setBrands([]);
    setSelectedBrand(null);
    setSelectedClient(value);
    handleBrandByClient(value?.id);
    setArticle((prv: any) => ({
      ...prv,
      client_id: value?.id,
    }));
  };

  const handleBrandByClient = async (clientId: string) => {
    try {
      const response: any = await brandByClient(clientId);
      setBrands(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleValiddateOnSave = () => {
    if (
      !article?.client_id ||
      !article?.brand_id ||
      !article?.category ||
      !article?.art_name ||
      !article?.genre ||
      !article?.uom
    ) {
      return false;
    }
    return true;
  };

  const handleNewArticle = () => {
    setSelectedBrand(null);
    setSelectedClient(null);
    setSelectedCategory(null);

    setArticle({
      id: "",
      client_id: "",
      brand_id: "",
      category: "",
      art_name: "",
      genre: "",
      uom: "",
    });

    clientRef?.current?.focus();
  };

  const handleArticleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArticle((prv: any) => ({
      ...prv,
      [event.target.name]:
        event.target.name === "hero"
          ? event.target.checked
          : event.target.value,
    }));
  };

  const handleSaveArticle = async () => {
    try {
      if (handleValiddateOnSave()) {
        const response: any = await addArticle(article);
        if (response.status) {
          setArticle(response.data);

          setAlert({
            open: true,
            message: "article saved successfully",
            serverity: "success",
          });
          await allArticles();
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

  const handleUpdateArticle = async () => {
    try {
      if (handleValiddateOnSave()) {
        const response: any = await updateArticle(article);
        if (response.status) {
          await allArticles();
        }
        setAlert({
          open: true,
          message: response.msg,
          serverity: response.status ? "success" : "error",
        });
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

  const handleArticleById = async (articleId: string) => {
    try {
      const response: any = await getArticleById(articleId);

      if (response.status) {
        setArticle(response.data);
        setSelectedClient({
          id: response.data.client_id,
          name: response.data.client,
        });
        setSelectedBrand({
          id: response.data.brand_id,
          name: response.data.brand,
        });
        setSelectedCategory({
          id: response.data.cat_id,
          name: response.data.category,
        });
      }
      setTabIndex(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response: any = await deleteArticle(article?.id);
      if (response.status) {
        handleNewArticle();
        await allArticles();
      }

      setAlert({
        open: true,
        message: response.msg,
        serverity: response.status ? "success" : "error",
      });
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
    <Box component={"div"} sx={{ mt: 1 }}>
      <Typography variant="h4" color="primary">
        Manage Articles
      </Typography>
      <Box sx={{ py: 1 }}>
        <Tabs value={tabIndex} onChange={handleChangeTab}>
          <Tab label="Add Article" value={0}></Tab>
          <Tab label="Article List" value={1}></Tab>
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0} key={0}>
        <Box sx={{ py: 2, pr: 2 }}>
          <Box
            component={"div"}
            display="flex"
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              mb: 1,
            }}
          >
            <Button
              onClick={handleNewArticle}
              variant="outlined"
              sx={{ mb: 1 }}
            >
              New Article
            </Button>
          </Box>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                sx={{
                  mb: { xs: -1, md: 0 },
                }}
                slotProps={{ inputLabel: { shrink: true } }}
                name="id"
                onChange={handleArticleChange}
                value={article?.id}
                fullWidth
                label="ID"
                disabled
              />
            </Grid>
            <Grid size={8}></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    error={article?.client_id ? false : true}
                    {...params}
                    inputRef={clientRef}
                    label="Select Client"
                    fullWidth
                  />
                )}
                value={selectedClient}
                onChange={(event, newValue) => {
                  handleChangeClient(newValue);
                }}
                loading={true}
                loadingText="Loading clients ..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={brands}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Brand"
                    error={article?.brand_id ? false : true}
                  />
                )}
                value={selectedBrand}
                onChange={(event, newValue) => {
                  setSelectedBrand(newValue);
                  setArticle((prv: any) => ({
                    ...prv,
                    brand_id: newValue?.id,
                  }));
                }}
                loading={true}
                loadingText="Loading brands ..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Select
                key={article?.genre}
                name="genre"
                value={article?.genre}
                onChange={handleArticleChange}
                fullWidth
                error={article?.genre ? false : true}
                renderValue={(value) => value}
              >
                <MenuItem value={"Ladies"}>Ladies</MenuItem>
                <MenuItem value={"Gents"}>Gents</MenuItem>
                <MenuItem value={"Youth"}>Youth</MenuItem>
                <MenuItem value={"Unisex"}>Unisex</MenuItem>
              </Select>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={categories}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Catgory"
                    error={article?.category ? false : true}
                  />
                )}
                value={selectedCategory}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue);
                  setArticle((prv: any) => ({
                    ...prv,
                    category: newValue?.name,
                  }));
                }}
                loading={true}
                loadingText="Loading categories ..."
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="art_name"
                onChange={handleArticleChange}
                value={article?.art_name}
                fullWidth
                label="article name"
                error={article?.art_name ? false : true}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Select
                displayEmpty={true}
                renderValue={(value) => (!value ? "Select UOM " : value)}
                key={article?.uom}
                name="uom"
                value={article?.uom}
                onChange={handleArticleChange}
                fullWidth
                error={article?.uom ? false : true}
              >
                <MenuItem value={"Pairs"}>Pairs</MenuItem>
                <MenuItem value={"Pcs"}>Pcs</MenuItem>
              </Select>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                label="Hero"
                control={
                  <Switch
                    name="hero"
                    checked={article?.hero}
                    onChange={handleArticleChange}
                  />
                }
              />
            </Grid>
          </Grid>
          <Box>
            <Button
              variant="outlined"
              onClick={() =>
                article?.id ? handleUpdateArticle() : handleSaveArticle()
              }
              sx={{ mt: 2, mr: 2, width: 100 }}
            >
              {article?.id ? "Update" : "Save"}
            </Button>
            <Button
              onClick={handleDelete}
              sx={{ mt: 2, width: 100 }}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={1} key={1}>
        <Box
          sx={{
            py: 2,

            boxSizing: "border-box",
            backgroundColor: "background.default",
          }}
        >
          <Box
            sx={{
              width: {
                xs: `calc(100vw - ${util.erpGridMarginX}px)`,
                lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
              },

              mt: 2,
              "& .article-id:hover": {
                textDecoration: "underline",
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <ERPGrid
              gridHeight={"70vh"}
              exportToExcel={true}
              ref={GridRef}
              columnDefs={columns}
              rowData={articles}
            />
          </Box>
        </Box>
      </TabPanel>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        message={alert.message}
        serverity={alert.serverity}
      />
    </Box>
  );
}

export default AddParentArticle;
