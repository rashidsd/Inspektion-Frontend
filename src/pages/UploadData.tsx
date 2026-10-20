import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import * as XLSX from "xlsx";
import { uploadArticles } from "../services/articleService";
import { uploadCategories } from "../services/categoryService";
import InputFileUpload from "../components/InputFileUpload";
import { uploadColors } from "../services/colorService";
import { uploadSizes } from "../services/sizeService";
import Typography from "@mui/material/Typography";
import ERPSnakBar from "../components/ERPSnakBar";
import AutoComplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getClientForSelection } from "../services/clientService";
import { brandByClient } from "../services/clientService";
import {
  uploadParentArticles,
  getParentArticlesByClientId,
} from "../services/parent_articleService";

function UploadData() {
  const [articleFile, setArticleFile] = useState<any>();
  const [uploadingArticle, setUploadingArticle] = useState(false);
  const [childArticleFile, setChildArticleFile] = useState<any>();
  const [uploadingChildArticle, setUploadingChildArticle] = useState(false);
  const [categoryFile, setCategoryFile] = useState<any>();
  const [uploadingCategory, setUploadingCategory] = useState(false);
  const [sizeFile, setSizeFile] = useState<any>();
  const [uploadingSize, setUploadingSize] = useState(false);
  const [colorFile, setColorFile] = useState<any>();
  const [uploadingColor, setUploadingColor] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [parentArticles, setUploadingArticles] = useState<any[]>([]);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  useEffect(() => {
    const getClients = async () => {
      try {
        const response: any = await getClientForSelection();
        setClients(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getClients();
  }, []);

  const handleClientChange = async (value: any) => {
    try {
      handleBrandByClient(value?.id);
      setSelectedClient(value);
      const response: any = await getParentArticlesByClientId(value?.id);
      setUploadingArticles(response.data);
      setBrands(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
      console.log(error);
    }
  };

  const handleBrandByClient = async (clientId: string) => {
    try {
      const response: any = await brandByClient(clientId);
      setBrands(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSizeFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const sizes = jsonData.map((row: any) => {
        return {
          id: row[0],
          size_name: row[1]?.toString().trim(),
          category: row[2] ? row[2]?.toString().trim() : "",
          descr: row[3] ? row[3]?.toString().trim() : "",
        };
      });
    
      setSizeFile(event.target.files[0]);
      await loadSizes(sizes);
    };
    reader.readAsArrayBuffer(file);
  };

  const getBrandId = (brand_name: string) => {
    const brand = brands.find((brand) => brand.name == brand_name);
    return brand ? brand.id : null;
  };

  const getParentInfo = (
    client_id: string | undefined,
    art_name: string | undefined
  ) => {
    const parentArticle = parentArticles.find(
      (article) =>
        article.art_name == art_name && article.client_id == client_id
    );
    return parentArticle ? parentArticle : null;
  };

  const handleCategoryFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const categories = jsonData.map((row: any) => {
        return {
          id: row[0],
          name: row[1]?.toString().trim(),
          descr: row[2] ? row[2]?.toString().trim() : "",
        };
      });
      setCategoryFile(event.target.files[0]);
      await loadCategories(categories);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleArticleFileChange = (event: any) => {
    if (!selectedClient) {
      setAlert({
        open: true,
        message: "Please select a client first",
        serverity: "error",
      });
      event.target.value = null;
      setArticleFile(null);
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
      const articles = jsonData.map((row: any) => {
        return {
          id: row["Code"]?.toString().trim(),
          art_name: row["Article Name"]?.toString().trim(),
          hero: row["Hero"]?.toString()?.trim()?.length > 0 ? true : false,
          client_id: selectedClient?.id,
          category: row["Category"]?.toString().trim(),
          brand_id: getBrandId(row["Brand"]?.toString().trim()),
          genre: row["Gender"]?.toString().trim(),
          uom: row["Uom"]?.toString().trim(),
        };
      });
      setArticleFile(event.target.files[0]);
      await loadArticles(articles);
      event.target.value = null;
    };
    reader.readAsArrayBuffer(file);
  };

  const handleChildArticleFileChange = (event: any) => {
    if (!selectedClient) {
      setAlert({
        open: true,
        message: "Please select a client first",
        serverity: "error",
      });
      event.target.value = null;
      setChildArticleFile(null);
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[1]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
      const articles = jsonData.map((row: any) => {
        const { client_id, hero, category, brand_id, uom, genre, id } =
          getParentInfo(
            selectedClient?.id,
            row["Article Name"]?.toString().trim()
          );
        return {
          id: row["Code"] == undefined ? "" : row["Code"]?.toString().trim(),
          art_no: id,
          art_name: row["Article Name"]?.toString().trim(),
          is_hero: hero,
          client_id: client_id,
          category: category,
          brand_id: brand_id,
          genre: genre,
          uom: uom,
          parent_id: id,
          color:
            row["Color"] == undefined ? "" : row["Color"]?.toString().trim(),
          size: row["Size"] == undefined ? "" : row["Size"]?.toString().trim(),
          season: row["Season"]?.toString().trim(),
          descr: row["Description"]?.toString().trim(),
          price: row["Cost"]?.toString().trim(),
          barcode: row["Barcode"]?.toString().trim(),
        };
      });
      setChildArticleFile(event.target.files[0]);
      await loadChildArticles(articles);
      console.log(articles);
      event.target.value = null;
    };
    reader.readAsArrayBuffer(file);
  };

  const handleColorFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const colors = jsonData.map((row: any) => {
        return {
          id: row[0],
          color_name: row[1]?.toString().trim(),
          code: row[2] ? row[2]?.toString().trim() : "",
          descr: row[3] ? row[3]?.toString().trim() : "",
        };
      });
      setColorFile(event.target.files[0]);
      await loadColors(colors);
    };
    reader.readAsArrayBuffer(file);
  };

  const loadArticles = async (data: any) => {
    try {
      setUploadingArticle(true);
      await uploadParentArticles(data);
      setUploadingArticle(false);
      setAlert({
        open: true,
        message: "Articles uploaded successfully",
        serverity: "success",
      });
    } catch (error) {
      setUploadingArticle(false);
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const loadChildArticles = async (data: any) => {
    try {
      setUploadingChildArticle(true);
      await uploadArticles(data);
      setUploadingChildArticle(false);
      setAlert({
        open: true,
        message: "Articles uploaded successfully",
        serverity: "success",
      });
    } catch (error) {
      setUploadingChildArticle(false);
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const loadSizes = async (data: any) => {
    try {
      setUploadingSize(true);
      await uploadSizes(data);
      setUploadingSize(false);
      setAlert({
        open: true,
        message: "Sizes uploaded successfully",
        serverity: "success",
      });
    } catch (error) {
      setUploadingSize(false);
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const loadColors = async (data: any) => {
    try {
      setUploadingColor(true);
      await uploadColors(data);
      setUploadingColor(false);
      setAlert({
        open: true,
        message: "Colors uploaded successfully",
        serverity: "success",
      });
    } catch (error) {
      setUploadingColor(false);
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const loadCategories = async (data: any) => {
    try {
      setUploadingCategory(true);
      await uploadCategories(data);
      setUploadingCategory(false);
      setAlert({
        open: true,
        message: "Categories uploaded successfully",
        serverity: "success",
      });
    } catch (error) {
      setUploadingCategory(false);
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
      <Box sx={{ m: 4 }}>
        <Box
          component={"div"}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <InputFileUpload
            size={"small"}
            isIcon={true}
            lable={
              uploadingArticle ? "Uploading....." : "Upload Parent Articles"
            }
            fileChange={handleArticleFileChange}
            variant="contained"
            minWidth="180px"
          />

          <AutoComplete
            sx={{ width: "300px", ml: 2 }}
            options={clients}
            getOptionLabel={(option: any) => option?.name}
            value={selectedClient}
            onChange={(event: any, value: any) => {
              handleClientChange(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Client" variant="outlined" />
            )}
          />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {articleFile?.name}
          </Typography>
        </Box>

        <Box
          component={"div"}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <InputFileUpload
            size={"small"}
            isIcon={true}
            lable={
              uploadingArticle ? "Uploading....." : "Upload Child Articles"
            }
            fileChange={handleChildArticleFileChange}
            variant="contained"
            minWidth="180px"
          />

          <Typography variant="body1" sx={{ ml: 1 }}>
            {childArticleFile?.name}
          </Typography>
        </Box>
        <Box
          component={"div"}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <InputFileUpload
            size={"small"}
            isIcon={true}
            lable={uploadingCategory ? "Uploading....." : "Upload Categories"}
            fileChange={handleCategoryFileChange}
            variant="contained"
            minWidth="180px"
          />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {categoryFile?.name}
          </Typography>
        </Box>

        <Box
          component={"div"}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <InputFileUpload
            size={"small"}
            isIcon={true}
            lable={uploadingColor ? "Uploading....." : "Upload Colors"}
            fileChange={handleColorFileChange}
            variant="contained"
            minWidth="180px"
          />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {colorFile?.name}
          </Typography>
        </Box>

        <Box
          component={"div"}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <InputFileUpload
            size={"small"}
            isIcon={true}
            lable={uploadingSize ? "Uploading....." : "Upload Sizes"}
            fileChange={handleSizeFileChange}
            variant="contained"
            minWidth="180px"
          />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {sizeFile?.name}
          </Typography>
        </Box>
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />
    </>
  );
}

export default UploadData;
