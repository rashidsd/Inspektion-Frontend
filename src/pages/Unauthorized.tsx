import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate(-1);
  };

  return (
    <Box
      width="95vw"
      height={"85vh"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm" style={{ textAlign: "center" }}>
        <Typography variant="h2" color="error">
          403
        </Typography>
        <Typography variant="h5" style={{ margin: "20px 0" }}>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          Sorry, you do not have permission to access this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBackToHome}>
          Go Back
        </Button>
      </Container>
    </Box>
  );
};

export default Unauthorized;
