import { useState, useRef, useEffect } from "react";
import { getClientForSelection } from "../services/clientService";
import { brandByClient } from "../services/clientService";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ERPSnakBar from "../components/ERPSnakBar";
import { ColDef } from "ag-grid-community";
import ERPGrid from "../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid2";
import { util } from "../util";
import { getArticleList } from "../services/articleService";
import UpdateHero from "../components/UpdateHero";
import UpdateSeason from "../components/UpdateSeason";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function ArticleList() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [listType, setListType] = useState<string>("Color Wise");
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const GridRef = useRef<AgGridReact>(null);
  const [columns, setColumns] = useState<ColDef[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const articleColumns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 110,
    },
    {
      filter: true,
      field: "art_name",
      headerName: "Article Name",
      width: 200,
    },
    {
      filter: true,
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 120,
    },
    {
      filter: true,
      field: "hero",
      headerName: "Hero",
      cellRenderer: (params: any) => {
        return <UpdateHero id={params.data.id} hero={params.data.hero} />;
      },
    },
    {
      filter: true,
      field: "genre",
      headerName: "Genre",
      minWidth: 130,
      flex: 1,
    },
  ];

  const colorColumns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 110,
    },
    {
      filter: true,
      field: "art_name",
      headerName: "Article Name",
      width: 200,
    },
    {
      filter: true,
      field: "color",
      headerName: "Color",
      width: 200,
    },
    {
      field: "season",
      headerName: "Season",
      cellRenderer: (params: any) => {
        return (
          <UpdateSeason
            parent_id={params.data.id}
            color={params.data.color}
            season={params.data.season}
          />
        );
      },
    },
    {
      filter: true,
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 120,
    },
    {
      filter: true,
      field: "hero",
      headerName: "Hero",
      width: 80,
    },
    {
      filter: true,
      field: "genre",
      headerName: "Genre",
      minWidth: 130,
      flex: 1,
    },
  ];

  const sizeColumns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 110,
    },
    {
      filter: true,
      field: "art_name",
      headerName: "Article Name",
      width: 200,
    },
    {
      filter: true,
      field: "color",
      headerName: "Color",
      width: 200,
    },
    {
      filter: true,
      field: "size",
      headerName: "Size",
      width: 120,
    },
    {
      filter: true,
      field: "barcode",
      headerName: "Barcode",
      width: 150,
    },
    {
      filter: true,
      field: "price",
      headerName: "Price",
      width: 120,
    },
    {
      filter: true,
      field: "season",
      headerName: "Season",
      width: 150,
    },
    {
      filter: true,
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 120,
    },
    {
      filter: true,
      field: "hero",
      headerName: "Hero",
      width: 80,
    },
    {
      filter: true,
      field: "genre",
      headerName: "Genre",
      minWidth: 130,
      flex: 1,
    },
  ];

  const handleRefresh = async () => {
    try {
      setLoading(true);
      if (listType == "Article Wise") {
        setColumns(articleColumns);
      } else if (listType == "Color Wise") {
        setColumns(colorColumns);
      } else {
        setColumns(sizeColumns);
      }
      const response: any = await getArticleList(
        selectedClient?.id,
        selectedBrand?.id,
        listType
      );
      if (response.status) {
        setList(response.data);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setAlert({
        open: true,
        message: error?.response?.data?.message || "Error loading List",
        serverity: "error",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const allClients = async () => {
      const response: any = await getClientForSelection();
      setClients(response.data);
    };
    allClients();
  }, []);

  const handleBrandByClient = async (clientId: string) => {
    try {
      const response: any = await brandByClient(clientId);
      setBrands(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeClient = async (value: any) => {
    setBrands([]);
    setSelectedBrand(null);
    setSelectedClient(value);
    handleBrandByClient(value?.id);
  };

  return (
    <Box component={"div"} sx={{ mt: 1 }}>
      <Box sx={{ py: 2, pr: 2 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Select Client" fullWidth />
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
                <TextField {...params} label="Select Brand" />
              )}
              value={selectedBrand}
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
              }}
              loading={true}
              loadingText="Loading brands ..."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Select
              name="listType"
              value={listType}
              fullWidth
              onChange={(e) => {
                setListType(e.target.value);
              }}
            >
              <MenuItem value={"Article Wise"}>Article Wise</MenuItem>
              <MenuItem value={"Color Wise"}>Color Wise</MenuItem>
              <MenuItem value={"Size Wise"}>Size Wise</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Button onClick={handleRefresh} sx={{ mt: 1 }} variant="outlined">
          Refresh
        </Button>
      </Box>

      <Box
        sx={{
          // width: {
          //   xs: `calc(100vw - ${util.erpGridMarginX}px)`,
          //   lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
          // },

          mt: 2,
          "& .article-id:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <ERPGrid
          gridHeight={"70vh"}
          exportToExcel={false}
          ref={GridRef}
          columnDefs={columns}
          rowData={list}
        />
      </Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <ERPSnakBar
          open={alert.open}
          onClose={() => setAlert({ open: false, message: "", serverity: "" })}
          message={alert.message}
          serverity={alert.serverity}
        />
      </Box>
    </Box>
  );
}

export default ArticleList;
