import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import OutboundOutlinedIcon from "@mui/icons-material/OutboundOutlined";
import newssearch from "../../../assets/BestNewsSearch/bestnewsserch.png";
import logo from "../../../assets/logo.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

function BestNewsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTitles, setFilteredTitles] = useState([]);

  const articles = [
    {
      title: "set video playback speed with javascript version",
      views: 36,
      date: "Dec 6, 2024",
      image: newssearch,
    },
    {
      title: "set video playback speed with javascript version",
      views: 42,
      date: "Dec 5, 2024",
      image: newssearch,
    },
    {
      title: "set video playback speed with javascript version",
      views: 24,
      date: "Dec 4, 2024",
      image: newssearch,
    },
    {
      title: "set video playback speed with javascript version",
      views: 50,
      date: "Dec 3, 2024",
      image: newssearch,
    },
  ];

  const handleSearch = () => {
    const result = articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTitles(result);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (!event.target.value) {
      setFilteredTitles(articles);
    } else {
      const result = articles.filter((article) =>
        article.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredTitles(result);
    }
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOutboundClick = () => {
    navigate("/News");
  };

  const handleCloseClick = () => {
    navigate("/");
  };

  return (
    <Box>
      {/* Header Section */}
      <Stack
        width="100%"
        maxWidth="80%"
        margin="auto"
        marginTop={5}
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
      >
        {/* Logo */}
        <Box textAlign="left">
          <img
            src={logo}
            alt="Best News Hub Logo"
            style={{ width: isSmallScreen ? "70px" : "200px" }}
          />
        </Box>

        {/* Search Field */}
        <TextField
          sx={{
            width: "24em",
            height: { xs: "2.5em", sm: "3em", md: "3.5em" },
            "& .MuiInputBase-input::placeholder": {
              fontWeight: "bold",
              color: "#000000",
              opacity: 1,
              mb: 1,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#000000",
              },
              "&:hover fieldset": {
                borderColor: "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000000",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: { xs: "8px", sm: "10px", md: "12px" }, // Adjust padding for a better look
            },
          }}
          placeholder="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* Close Button */}
        <IconButton
          onClick={handleCloseClick}
          sx={{
            "&:hover": { backgroundColor: "#ffffff" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      {/* Articles Section */}
      <Stack
        width="100%"
        maxWidth="80%"
        margin="auto"
        ml={"xs:0"}
        marginTop={4}
        spacing={3}
        boxShadow={0}
      >
        {filteredTitles.length > 0 ? (
          filteredTitles.map((article, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "row" }, // Column for mobile, row for desktop
                boxShadow: "none",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "50%", sm: "300px" }, // Full width on mobile, fixed width on desktop
                  height: { xs: "100px", sm: "130px" }, // Adjust height for mobile
                  borderRadius: "0",
                }}
                onClick={handleOutboundClick}
                image={article.image}
                alt={article.title}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  padding: { xs: "3px 10px", sm: "10px 18px" },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="400"
                  fontSize={{ xs: "11px", sm: "18px" }}
                  color="text.primary"
                >
                  {article.title.split(" ").map((word, index) => (
                    <>
                      {word}
                      {(index + 1) % 4 === 0 ? <br /> : (index + 1) % 4 === 0}
                    </>
                  ))}
                </Typography>
                <Stack
                  direction="row"
                  spacing={{ xs: 0.1, sm: 1 }}
                  alignItems="center"
                  sx={{
                    flexWrap: { xs: "nowrap", sm: "nowrap" },
                  }}
                >
                  <VisibilityIcon
                    fontSize="small"
                    color="action"
                    sx={{
                      fontSize: { xs: "8px", sm: "24px" },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={{ xs: "8px", sm: "16px" }}
                  >
                    {article.views} views
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={{ xs: "8px", sm: "16px" }}
                  >
                    | {article.date}
                  </Typography>
                  <IconButton
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "end" },
                      marginLeft: { xs: "0", sm: "2em" },
                      color: "#a0522d",
                    }}
                    onClick={handleOutboundClick}
                  >
                    <OutboundOutlinedIcon
                      sx={{
                        fontSize: { xs: "10px", sm: "28px" },
                      }}
                    />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No articles found.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default BestNewsSearch;
