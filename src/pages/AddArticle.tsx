import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import InputFileUpload from "../components/InputFileUpload";
import Grid from "@mui/material/Grid2";
import { getClientForSelection } from "../services/clientService";
import { getCategoriesForSelection } from "../services/categoryService";
import { brandByClient } from "../services/clientService";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState, useRef } from "react";
import { ArticleType, ArticleSpecType } from "../customTypes/customTypes";
import ERPSnakBar from "../components/ERPSnakBar";
import { ColDef } from "ag-grid-community";
import ERPGrid from "../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import ArticleSpecCard2 from "../components/ArticleSpecCard2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  addArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../services/articleService";
import {
  addArticleSpec,
  getArticleSpecs,
} from "../services/articleSpecService";
import { getParentArticles } from "../services/parent_articleService";
import { getColorsForSelection } from "../services/colorService";
import { getSizesForSelection } from "../services/sizeService";
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

function AddArticle() {
  const [clients, setClients] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [colors, setColors] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [sizes, setSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [disableInUse, setDisableInUse] = useState<number>(0);
  const [specImg, setSpecImg] = useState<any>(null);
  const [specImgUrl, setSpecImgUrl] = useState<string | undefined>(undefined);
  const [articleSpecs, setArticleSpecs] = useState<any[]>([]);
  const [parentArticles, setParentArticles] = useState<any[]>([]);
  const [selectedParentArticle, setSelectedParentArticle] = useState<
    any | null
  >(null);
  const [articleSpec, setArticleSpec] = useState<ArticleSpecType>({
    article_id: "",
    descr: "",
    file_name: "",
    url: "",
    ext: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const clientRef = useRef<HTMLInputElement>(null);
  const GridRef = useRef<AgGridReact>(null);

  const SpecificationsWidth = 220;

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
      field: "art_no",
      headerName: "Article No",
      width: 170,
      filter: true,
    },
    {
      field: "art_name",
      headerName: "Atricle Name",
      filter: true,
    },
    {
      field: "color",
      headerName: "Color",
      width: 170,
      filter: true,
    },
    {
      field: "size",
      headerName: "Size",
      width: 110,
      filter: true,
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 90,
    },

    {
      field: "barcode",
      headerName: "Barcode",
      width: 120,
      filter: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      filter: true,
    },
    {
      field: "descr",
      headerName: "Description",
      minWidth: 130,
      flex: 1,
    },
  ];

  const allArticles = async () => {
    const response: any = await getArticles();
    setArticles(response.data);
  };
  useEffect(() => {
    allArticles();
  }, []);

  useEffect(() => {
    const parentArticles = async () => {
      const response: any = await getParentArticles();
      setParentArticles(response.data);
    };
    parentArticles();
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

  useEffect(() => {
    const allColors = async () => {
      const response: any = await getColorsForSelection();
      setColors(response.data);
    };
    allColors();
  }, []);

  useEffect(() => {
    const allSizes = async () => {
      const response: any = await getSizesForSelection();
      setSizes(response.data);
    };
    allSizes();
  }, []);

  const handleChangeParentArticle = async (value: any) => {
    setSelectedParentArticle(value);
    setSelectedClient({ id: value?.client_id, name: value?.client });
    setSelectedBrand({ id: value?.barand_id, name: value?.brand });
    setSelectedCategory({ id: value?.category, name: value?.category });
    setSelectedColor(null);
    setSelectedSize(null);
    setArticle({
      id: "",
      client_id: value?.client_id,
      brand_id: value?.brand_id,
      category: value?.category,
      art_no: value?.id,
      art_name: value?.art_name,
      barcode: "",
      descr: "",
      genre: value?.genre,
      color: "",
      size: "",
      price: undefined,
      uom: value?.uom,
      is_hero: value?.hero,
      parent_id: value?.id,
      season: "",
    });
  };

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
    if (newValue === 1) {
      handleArticleSpecs();
    }
  };

  const handleValiddateOnSave = () => {
    if (
      !article?.client_id ||
      !article?.brand_id ||
      !article?.category ||
      !article?.art_no ||
      !article?.art_name ||
      !article?.genre ||
      !article?.color ||
      !article?.size ||
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
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedParentArticle(null);

    setArticle({
      id: "",
      client_id: "",
      brand_id: "",
      category: "",
      art_no: "",
      art_name: "",
      barcode: "",
      descr: "",
      genre: "",
      color: "",
      size: "",
      price: undefined,
      uom: "",
      is_hero: false,
      parent_id: "",
      season: "",
    });

    setDisableInUse(0);
    clientRef?.current?.focus();
  };

  const handleArticleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArticle((prv: any) => ({
      ...prv,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSaveArticle = async () => {
    try {
      if (handleValiddateOnSave()) {
        const response: any = await addArticle(article);
        setAlert({
          open: true,
          message: "article saved successfully",
          serverity: "success",
        });
        await allArticles();
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
        setAlert({
          open: true,
          message: "article update successfully",
          serverity: "success",
        });
        await allArticles();
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
        setSelectedColor({
          color_name: response.data.color,
        });

        setSelectedSize({
          size_name: response.data.size,
        });

        const parent = parentArticles.find(
          (parent) => parent.id === response.data.parent_id
        );
        setSelectedParentArticle(parent);
        setDisableInUse(Number(response.data.in_use));
      }
      setTabIndex(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response: any = await deleteArticle(article?.id);

      setAlert({
        open: true,
        message: "article deleted successfully",
        serverity: "success",
      });
      handleNewArticle();
      await allArticles();
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
  const handleChangeArtileSpec = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setSpecImg(event.target.files[0]);
      setSpecImgUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSaveArticleSpec = async () => {
    const formData = new FormData();

    formData.append("file", specImg);
    articleSpec.article_id = article?.id || "";
    formData.append("data", JSON.stringify(articleSpec));

    try {
      const response: any = await addArticleSpec(formData);
      setAlert({
        open: true,
        message: "article spec saved successfully",
        serverity: "success",
      });
      setSpecImg(null);
      setSpecImgUrl(undefined);
      setArticleSpec((prv: any) => ({
        article_id: "",
        descr: "",
        file_name: "",
        url: "",
        ext: "",
      }));
      handleArticleSpecs();
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

  const handleArticleSpecs = async () => {
    const response: any = await getArticleSpecs(article?.id);
    setArticleSpecs(response.data);
  };

  return (
    <Box component={"div"} sx={{ mt: 1 }}>
      <Typography variant="h4" color="primary">
        Manage Articles
      </Typography>
      <Box sx={{ py: 1 }}>
        <Tabs value={tabIndex} onChange={handleChangeTab}>
          <Tab label="Add Article" value={0}></Tab>
          <Tab label="Specifications" value={1}></Tab>
          <Tab label="Article List" value={2}></Tab>
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
                name="id"
                onChange={handleArticleChange}
                value={article?.id}
                fullWidth
                label="ID"
                disabled
              />
            </Grid>
            <Grid size={8}></Grid>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={parentArticles}
                getOptionLabel={(option) =>
                  option.id + "     " + option.art_name + "     " + option.brand
                }
                renderInput={(params) => (
                  <TextField
                    error={article?.parent_id ? false : true}
                    {...params}
                    label="Select Parent Article"
                    fullWidth
                  />
                )}
                value={selectedParentArticle}
                onChange={(event, newValue) => {
                  handleChangeParentArticle(newValue);
                }}
                loading={true}
                loadingText="Loading Parent Articles ..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                disabled
                renderInput={(params) => (
                  <TextField
                    // error={article?.client_id ? false : true}
                    {...params}
                    inputRef={clientRef}
                    label="Client"
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
                disabled
                renderInput={(params) => (
                  <TextField {...params} label="Brand" />
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
                disabled
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
                disabled
                renderInput={(params) => (
                  <TextField {...params} label="Catgory" />
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
                key={new Date().toISOString()}
                name="art_no"
                onChange={handleArticleChange}
                value={article?.art_no}
                fullWidth
                label="article no"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                key={new Date().toISOString()}
                name="art_name"
                // onChange={handleArticleChange}
                value={article?.art_name}
                fullWidth
                label="Article Name"
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={colors}
                getOptionLabel={(option) => option.color_name}
                disabled={disableInUse > 0}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Color"
                    error={article?.color ? false : true}
                  />
                )}
                value={selectedColor}
                onChange={(event, newValue) => {
                  setSelectedColor(newValue);
                  setArticle((prv: any) => ({
                    ...prv,
                    color: newValue?.color_name,
                  }));
                }}
                loading={true}
                loadingText="Loading colors ..."
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={sizes}
                getOptionLabel={(option) => option.size_name}
                disabled={disableInUse > 0}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Size"
                    error={article?.size ? false : true}
                  />
                )}
                value={selectedSize}
                onChange={(event, newValue) => {
                  setSelectedSize(newValue);
                  setArticle((prv: any) => ({
                    ...prv,
                    size: newValue?.size_name,
                  }));
                }}
                loading={true}
                loadingText="Loading Size ..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="barcode"
                onChange={handleArticleChange}
                value={article?.barcode}
                fullWidth
                label="Barcode"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Select
                displayEmpty={true}
                renderValue={(value) => (!value ? "UOM " : value)}
                key={article?.uom}
                name="uom"
                value={article?.uom}
                onChange={handleArticleChange}
                fullWidth
                disabled
              >
                <MenuItem value={"Pairs"}>Pairs</MenuItem>
                <MenuItem value={"Psc"}>Psc</MenuItem>
              </Select>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="price"
                onChange={handleArticleChange}
                value={article?.price}
                fullWidth
                label="Price"
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="season"
                onChange={handleArticleChange}
                value={article?.season}
                fullWidth
                label="Season"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="descr"
                onChange={handleArticleChange}
                value={article?.descr}
                fullWidth
                label="Description"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
                variant="body1"
                color="success"
              >
                {article?.is_hero ? "Hero Article" : ""}
              </Typography>
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
              disabled={disableInUse > 0}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={1} key={1}>
        <Box sx={{ py: 2 }}>
          <Box
            display={"flex"}
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "none" }}
            justifyContent="space-between"
            gap={1}
            sx={{
              width: { xs: 300, sm: 530, md: 700 },
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: "column",
                width: "100%",
              }}
            >
              <TextField
                label="Article No"
                value={article?.art_no}
                disabled
                fullWidth
              />
              <TextField
                label="Article Name"
                value={article?.art_name}
                disabled
                fullWidth
              />
              <TextField
                value={articleSpec.descr}
                onChange={(e) =>
                  setArticleSpec((prv: any) => ({
                    ...prv,
                    descr: e.target.value,
                  }))
                }
                label="Description"
                fullWidth
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <InputFileUpload
                  lable="Upload"
                  fileChange={handleChangeArtileSpec}
                  flex={1}
                />
                <Button
                  sx={{ flex: 1 }}
                  onClick={handleSaveArticleSpec}
                  variant="outlined"
                >
                  submit
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                style={{}}
                src={specImgUrl}
                width={SpecificationsWidth}
                height={SpecificationsWidth}
                alt="file"
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ py: 2, px: 2, width: "80vw" }}>
          <Box
            display={"flex"}
            justifyContent={{ xs: "center", sm: "flex-start" }}
            gap={2}
            sx={{
              flexWrap: "wrap",
              boxSizing: "border-box",
            }}
          >
            {articleSpecs?.map((spec: any) => (
              <ArticleSpecCard2
                key={spec.id}
                id={spec.id}
                specUrl={spec.url}
                descr={spec.descr}
                articleSpecs={handleArticleSpecs}
              />
            ))}
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={2} key={2}>
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

export default AddArticle;
