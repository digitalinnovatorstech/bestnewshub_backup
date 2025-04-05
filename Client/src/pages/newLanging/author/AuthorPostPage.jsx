import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  Container,
  Stack,
  Button,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Autocomplete,
  Divider,
} from "@mui/material";
import avatarImage from "../../../assets/main/authorpost.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  getAllTags,
  getCategoryFindall,
} from "../../../services/slices/globalSlice";
import axios from "axios";
import { Save, Image } from "@mui/icons-material";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  getLandingYourPendingPostList,
  getLandingYourPostList,
} from "../../../services/slices/landingSlice";
import { getIdList } from "../../../utility/helpers/globalHelpers";

const inputLabelStyle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: "3px",
};

const redStarStyle = {
  color: "red",
  marginLeft: "4px",
};

const homelayoutList = [
  { id: "INTERNATIONAL", name: "International" },
  { id: "NATIONAL", name: "National" },
  { id: "SHORT", name: "Short" },
  { id: "FEATURED", name: "Featured" },
  { id: "EASY_SEARCH", name: "Easy Search" },
];

const posts = [
  {
    id: 1,
    title: "SC FINDS THINGS AMISS IN THE KOLKATA RAPE-MURDER CASE",
    date: "21-11-2024 | 10:30 AM",
    image: avatarImage,
  },
  {
    id: 2,
    title: "SC FINDS THINGS AMISS IN THE KOLKATA RAPE-MURDER CASE",
    date: "22-11-2024 | 11:00 AM",
    image: avatarImage,
  },
  {
    id: 3,
    title: "SC FINDS THINGS AMISS IN THE KOLKATA RAPE-MURDER CASE",
    date: "23-11-2024 | 02:30 PM",
    image: avatarImage,
  },
  {
    id: 4,
    title: "SC FINDS THINGS AMISS IN THE KOLKATA RAPE-MURDER CASE",
    date: "24-11-2024 | 09:00 AM",
    image: avatarImage,
  },
];
const pendingPosts = [
  {
    id: 1,
    title: "SC FINDS THINGS AMISS IN THE KOLKATA RAPE-MURDER CASE",
    date: "25-11-2024 | 10:30 AM",
    image: avatarImage,
  },
];

function AuthorPostPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.only("sm"));
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const landingYourPostList = useSelector(
    (state) => state.global.landingYourPostList
  );
  const landingYourPendingPostList = useSelector(
    (state) => state.global.landingYourPendingPostList
  );
  const categoryFindall = useSelector((state) => state.global.categoryFindall);
  const categories = getIdList(categoryFindall);
  const allTagList = useSelector((state) => state.global.allTagList);
  useEffect(() => {
    dispatch(getLandingYourPostList());
    dispatch(getLandingYourPendingPostList());
    dispatch(getCategoryFindall());
    dispatch(getAllCategories());
    dispatch(getAllTags());
  }, [dispatch]);
  const [formValues, setFormValues] = useState({
    title: "",
    permalink: "",
    content: "",
    layout: "",
    status: "Pending",
    categoryIds: null,
    tagIds: [],
    homeLayout: "",
    categoryLayout: "",
    faq: [],
    metaTitle: "",
    metaDescription: "",
    isPublished: "",
    isIndex: "",
    publishedAt: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verticalImage, setverticalImage] = useState(null);
  const verticalImageInputRef = useRef(null);
  const [horizontalImage, sethorizontalImage] = useState(null);
  const horizontalImageInputRef = useRef(null);
  const [squareImage, setsquareImage] = useState(null);
  const squareImageInputRef = useRef(null);

  // for input change
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      if (value.length > 150) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Title cannot exceed 150 characters.",
        }));
        return;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    if (name === "publishedAt") {
      const today = new Date();
      const selectedDate = new Date(value);

      if (selectedDate > today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Publish date cannot be in the future",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
      return;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  // for normal  select
  const onSelectChangeHandler = (name, value) => {
    if (name === "categoryIds") {
      const selectedCategory = categories?.find(
        (category) => category.id === value
      );
      const categoryName = selectedCategory ? selectedCategory.name : "";
      const path = `${categoryName}/${formValues.title}`;
      setFormValues((prevValues) => ({
        ...prevValues,
        permalink: path?.toLowerCase().replace(/ /g, "-"),
      }));
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // for tag change
  const handleTagChange = (event, value) => {
    const selectedTagIds = value?.map((tag) => tag.id);
    setFormValues((prevValues) => ({
      ...prevValues,
      tagIds: selectedTagIds,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.title) newErrors.title = "Post Title is required";
    if (!formValues.permalink) newErrors.permalink = "Permalink is required";
    if (!formValues.publishedAt)
      newErrors.publishedAt = "Publish Date is required";
    if (!formValues.categoryIds) newErrors.categoryIds = "category is required";
    if (!formValues.metaTitle) newErrors.metaTitle = "SEO Title is required";
    if (!formValues.metaDescription)
      newErrors.metaDescription = "SEO Description is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = new FormData();
    Object.keys(formValues).forEach((key) => {
      data.append(key, formValues[key]);
    });
    if (verticalImage) {
      data.append("verticalImageUrl", verticalImage);
    }
    if (horizontalImage) {
      data.append("SEOImageUrl", horizontalImage);
    }
    if (squareImage) {
      data.append("squareImageUrl", squareImage);
    }
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/posts/create`, data, {
        headers: {
          Authorization: `Bearer ${datakey?.token?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
        setFormValues({
          title: "",
          permalink: "",
          content: "",
          layout: "",
          status: "Pending",
          categoryIds: null,
          tagIds: [],
          homeLayout: "",
          categoryLayout: "",
          faq: [],
          metaTitle: "",
          metaDescription: "",
          isPublished: "",
          isIndex: "",
          publishedAt: "",
        });
        setverticalImage(null);
        sethorizontalImage(null);
        setsquareImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (label, name, type = "text", required = false) => (
    <Grid pt={2} item style={{ width: "100%" }}>
      <InputLabel sx={inputLabelStyle}>
        {label}
        {required && <span style={redStarStyle}>*</span>}
      </InputLabel>
      <FormControl
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors[name]}
      >
        <OutlinedInput
          sx={{
            "& .MuiInputBase-input::placeholder": {
              fontSize: "0.8rem",
              color: "#895129",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#895129",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#895129",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#895129",
            },
          }}
          fullWidth
          id={name}
          placeholder={`Enter ${label}`}
          size="small"
          name={name}
          type={type}
          value={formValues[name] || ""}
          onChange={onChangeHandler}
          error={!!errors[name]}
        />
        {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
    </Grid>
  );

  const renderSelectField = (
    label,
    name,
    data,
    required = false,
    disabled = false
  ) => (
    <Grid item pt={2} style={{ width: "100%" }}>
      <InputLabel
        sx={{
          color: "black",
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        {label}
        {required && <span style={redStarStyle}>*</span>}
      </InputLabel>
      <FormControl
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors[name]}
      >
        <SingleSelect
          width={"100%"}
          disabled={disabled}
          data={data}
          value={formValues[name] || ""}
          onChange={(value) => onSelectChangeHandler(name, value)}
          placeholder={`Select ${label}`}
        />
        {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
    </Grid>
  );

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <ToastContainer />
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12} md={3} sx={{ position: "relative" }}>
            <Box
              sx={{
                border: isMobile ? "none" : "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#FFF",
                padding: "10px",
                height: isMobile ? "auto" : "650px",
                width: "100%",
                marginTop: isMobile ? 0 : 0,
              }}
            >
              <Typography
                sx={{
                  marginBottom: "10px",
                  fontSize: isMobile ? "12px" : "25px",
                }}
              >
                Your Postings
              </Typography>
              {posts.map((post, index) => (
                <Box
                  key={post.id || index}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    padding: isMobile ? "5px" : "10px",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={post.image}
                    alt="Avatar"
                    sx={{
                      marginRight: "10px",
                      borderRadius: 0,
                      width: "76px",
                      height: "76px",
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: isMobile
                          ? "10px"
                          : isTablet
                          ? "12px"
                          : "14px",
                        display: "block",
                      }}
                    >
                      {post.title.split(" ").slice(0, 5).join(" ") +
                        (post.title.split(" ").length > 5 ? "..." : "")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        marginTop: "5px",
                        fontSize: isMobile ? "8px" : isTablet ? "10px" : "12px",
                      }}
                    >
                      {post.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Typography variant="subtitle2" sx={{ marginTop: "20px" }}>
                Pending Posts
              </Typography>
              {pendingPosts.map((post, index) => (
                <Box
                  key={post.id || index}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={post.image}
                    alt="Avatar"
                    sx={{
                      marginRight: "10px",
                      borderRadius: 0,
                      width: "76px",
                      height: "76px",
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: isMobile
                          ? "10px"
                          : isTablet
                          ? "12px"
                          : "14px",
                        display: "block",
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        marginTop: "5px",
                        fontSize: isMobile ? "8px" : isTablet ? "10px" : "12px",
                      }}
                    >
                      {post.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                height: "auto",
                width: "100%",
              }}
            >
              <Stack
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 100,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "", sm: "space-between" },
                  backgroundColor: "#F9F9F9",
                  padding: "10px",
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Typography variant="h5">Create New Post</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: { xs: "center", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#895129",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#895129",
                      },
                      width: { xs: "100%", sm: "auto" },
                    }}
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#895129" }} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Stack>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: isTabMode ? "column" : "row",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <Stack
                  sx={{
                    width: isTabMode ? "100%" : "68%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack sx={{}}>
                    {renderTextField("Post Title", "title", "text", true)}
                    {renderSelectField(
                      "Category",
                      "categoryIds",
                      categories,
                      true
                    )}
                    {renderTextField("Permalink", "permalink", "text", true)}
                    <FormHelperText>https://bestnewshub.com/</FormHelperText>
                    <Box
                      sx={{
                        marginTop: "5px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        borderColor: "#895129",
                      }}
                    >
                      <Typography variant="h5" sx={inputLabelStyle}>
                        Content
                      </Typography>
                      <ReactQuill
                        value={formValues?.content || ""}
                        onChange={(content) =>
                          setFormValues((prevValues) => ({
                            ...prevValues,
                            content: content,
                          }))
                        }
                        modules={{
                          toolbar: [
                            [
                              { header: [1, 2, 3, 4, 5, 6, false] },
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                              "code-block",
                              { align: [] },
                              { list: "ordered" },
                              { list: "bullet" },
                              { list: "check" },
                              { indent: "-1" },
                              { indent: "+1" },
                              { script: "sub" },
                              { script: "super" },
                              { direction: "rtl" },
                              { color: [] },
                              { background: [] },
                              "link",
                              "image",
                            ],
                          ],
                          imageResize: {},
                        }}
                        formats={[
                          "header",
                          "list",
                          "indent",
                          "script",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "align",
                          "color",
                          "background",
                          "blockquote",
                          "link",
                          "image",
                        ]}
                        style={{
                          height: "300px",
                          maxHeight: "300px",
                          marginBottom: "20px",
                        }}
                      />
                      <style>
                        {`
                                      .ql-toolbar {
                                        background-color: #FCF8E7 !important;
                                        border-color: #895129 !important;
                                        color: #895129 !important;
                                        }
                                      .ql-container {
                                        border-color: #895129 !important;
                                        }
                                    `}
                      </style>
                    </Box>
                    <Box sx={{ marginTop: "10px" }}></Box>
                  </Stack>
                  <Stack
                    sx={{
                      border: "1px solid #ccc",
                      background: "#fff",
                      marginTop: "10px",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ marginBottom: "10px", marginLeft: "20px" }}
                    >
                      Search Engine Optimize
                    </Typography>
                    <Divider flexItem />
                    <Box sx={{ padding: "10px" }}>
                      <Typography
                        variant="h7"
                        sx={{
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        Setup meat title & description to make your site easy to
                        discovered on search engines such as Google
                      </Typography>
                      <Divider
                        flexItem
                        sx={{ borderWidth: "1px", background: "black" }}
                      />
                      {renderTextField("SEO Title", "metaTitle", "text")}
                      {renderTextField(
                        "SEO description",
                        "metaDescription",
                        "text"
                      )}
                    </Box>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: isTabMode ? "100%" : "30%",
                  }}
                >
                  {renderTextField(
                    "Published Date",
                    "publishedAt",
                    "date",
                    true
                  )}
                  {renderSelectField("Layout", "homeLayout", homelayoutList)}
                  <Box
                    sx={{
                      padding: "10px 0px",
                    }}
                  >
                    <Typography variant="h6" sx={{ marginBottom: "5px" }}>
                      Tag
                      {/* <span style={redStarStyle}>*</span> */}
                    </Typography>
                    <Box sx={{}}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!errors.tagIds}
                      >
                        <Autocomplete
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "0.8rem",
                              // color: "#895129",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#895129",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#895129",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#895129",
                            },
                          }}
                          multiple
                          error={!!errors.tagIds}
                          helperText={errors.tagIds ? errors.tagIds : null}
                          options={allTagList}
                          getOptionLabel={(option) => option?.name}
                          onChange={handleTagChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Select Tags"
                              size="small"
                            />
                          )}
                        />
                        {/* {errors.tagIds && (
                                      <FormHelperText>{errors.tagIds}</FormHelperText>
                                    )} */}
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      marginTop: "5px",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                      Vertical Image
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                        startIcon={<Image />}
                        onClick={() => verticalImageInputRef.current.click()}
                      >
                        Choose image
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/svg+xml"
                          multiple
                          hidden
                          ref={verticalImageInputRef}
                          onChange={(e) => setverticalImage(e.target.files[0])}
                        />
                      </Button>
                      {verticalImage && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            marginLeft: "10px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            flexDirection: "column",
                            color: "#895129",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CloudUploadIcon sx={{ marginRight: "5px" }} />
                            {verticalImage.name}
                          </div>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      marginTop: "5px",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                      Horizontal Image
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                        startIcon={<Image />}
                        onClick={() => horizontalImageInputRef.current.click()}
                      >
                        Choose image
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/svg+xml"
                          multiple
                          hidden
                          ref={horizontalImageInputRef}
                          onChange={(e) =>
                            sethorizontalImage(e.target.files[0])
                          }
                        />
                      </Button>
                      {horizontalImage && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            marginLeft: "10px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            flexDirection: "column",
                            color: "#895129",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CloudUploadIcon sx={{ marginRight: "5px" }} />
                            {horizontalImage.name}
                          </div>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      marginTop: "5px",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                      Square Image
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                        startIcon={<Image />}
                        onClick={() => squareImageInputRef.current.click()}
                      >
                        Choose image
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/svg+xml"
                          multiple
                          hidden
                          ref={squareImageInputRef}
                          onChange={(e) => setsquareImage(e.target.files[0])}
                        />
                      </Button>
                      {squareImage && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            marginLeft: "10px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            flexDirection: "column",
                            color: "#895129",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CloudUploadIcon sx={{ marginRight: "5px" }} />
                            {squareImage.name}
                          </div>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default AuthorPostPage;
