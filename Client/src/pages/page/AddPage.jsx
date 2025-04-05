import {
  Box,
  Button,
  Dialog,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
  TextareaAutosize,
} from "@mui/material";
import { useState, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SingleSelect } from "../../components/singleSelect/SingleSelect";
import { Save, Image, Close } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill, { Quill } from "react-quill";
// import ImageGallery from "../blog/posts/ImageGallery";

import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize";
Quill.register("modules/imageResize", ImageResize);

const Font = ReactQuill.Quill.import("formats/font"); // <<<< ReactQuill exports it
Font.whitelist = ["mirza", "roboto"];
ReactQuill.Quill.register(Font, true);

import axios from "axios";

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

const initialFormValues = {
  pageName: "",
  title: "",
  permalink: "",
  content: "",
  status: "",
  publishedAt: "",
  faq: [],
  metaTitle: "",
  metaDescription: "",
  metaTags: [],
  SEOImageUrl: "",
};

const statusList = [
  { id: "Published", name: "Published" },
  { id: "Draft", name: "Draft" },
];

const AddPage = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [activeButton, setActiveButton] = useState("Visual");
  const [seoImage, setSeoImage] = useState(null);
  const seoImageInputRef = useRef(null);
  const [openverticalPopup, setOpenverticalPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);

  // faq
  const handleAddNew = () => {
    setFormValues((prevState) => ({
      ...prevState,
      faq: [...prevState.faq, { question: "", answer: "" }],
    }));
  };
  const handleRemove = (index) => {
    const updatedFaqs = formValues.faq?.filter((_, i) => i !== index);
    setFormValues((prevState) => ({
      ...prevState,
      faq: updatedFaqs,
    }));
  };
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFaqs = formValues.faq?.map((faq, i) =>
      i === index ? { ...faq, [name]: value } : faq
    );
    setFormValues((prevState) => ({
      ...prevState,
      faq: updatedFaqs,
    }));
  };

  // const onChangeHandler = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value || "",
  //   }));
  //   setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

  //   if (name === "title") {
  //     if (value.length > 150) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         [name]: "Title cannot exceed 150 characters.",
  //       }));
  //       return;
  //     } else {
  //       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //     }
  //     const tempLink = value
  //       ?.toLowerCase()
  //       .replace(/\s+/g, "-")
  //       .replace(/[^a-z0-9-]/g, "");

  //     setFormValues((prevValues) => ({
  //       ...prevValues,
  //       [name]: value,
  //       permalink: tempLink,
  //     }));
  //     return;
  //   }
  //   if (name === "permalink") {
  //     setFormValues((prevValues) => {
  //       return {
  //         ...prevValues,
  //         [name]: value
  //           ?.toLowerCase()
  //           .trim()
  //           .replace(/\s+/g, "-")
  //           .replace(/-+/g, "-")
  //           .replace(/[^a-z0-9-/]/g, ""),
  //       };
  //     });

  //     return;
  //   }

  //   if (name === "publishedAt") {
  //     const today = new Date();
  //     const selectedDate = new Date(value);

  //     if (selectedDate > today) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         [name]: "Publish date cannot be in the future",
  //       }));
  //     } else {
  //       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //       setFormValues((prevValues) => ({
  //         ...prevValues,
  //         [name]: value,
  //       }));
  //     }
  //     return;
  //   }

  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value || "",
  //   }));

  //   setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  // };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value || "" };
      if (name === "pageName") {
        updatedValues.permalink = value
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      if (name === "permalink") {
        updatedValues.permalink = value
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/[^a-z0-9-/]/g, "");
      }
      if (name === "title" && value.length > 150) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Title cannot exceed 150 characters.",
        }));
        return prevValues;
      }
      if (name === "publishedAt") {
        const today = new Date();
        const selectedDate = new Date(value);
        if (selectedDate > today) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Publish date cannot be in the future",
          }));
          return prevValues;
        }
      }
      return updatedValues;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const onSelectChangeHandler = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // for meta tag
  const [inputValue, setInputValue] = useState("");
  const addMetaTag = () => {
    if (
      inputValue.trim() !== "" &&
      !formValues.metaTags.includes(inputValue.trim())
    ) {
      setFormValues((prevValues) => ({
        ...prevValues,
        metaTags: [...prevValues.metaTags, inputValue.trim()],
      }));
      setInputValue("");
      setErrors((prev) => ({ ...prev, metaTags: "" }));
    }
  };
  const handleAddMetaTag = (event) => {
    if (event.key === "Enter") {
      addMetaTag();
    }
  };
  const handleDeleteMetaTag = (tagToDelete) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      metaTags: prevValues.metaTags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.pageName) newErrors.pageName = "Page Name is required";
    if (!formValues.title) newErrors.title = "Title is required";
    if (!formValues.permalink) newErrors.permalink = "Permalink is required";
    if (!formValues.status) newErrors.status = "Status is required";
    if (!formValues.metaTitle) newErrors.metaTitle = "SEO Title is required";
    if (!formValues.metaDescription)
      newErrors.metaDescription = "SEO Descriptions is required";
    if (!formValues.metaTags || formValues?.metaTags?.length === 0)
      newErrors.metaTags = "At least one SEO Tag is required";
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
      if (key === "faq") {
        data.append("faq", JSON.stringify(formValues.faq));
      } else {
        data.append(key, formValues[key]);
      }
    });
    if (seoImage) {
      data.append("SEOImageUrl", seoImage);
    }
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/pages/create`, data, {
        headers: {
          Authorization: `Bearer ${datakey?.token?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
        setFormValues({});
        setSeoImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === "faq") {
        data.append("faq", JSON.stringify(formValues.faq));
      } else {
        data.append(key, formValues[key]);
      }
    });
    if (seoImage) {
      data.append("SEOImageUrl", seoImage);
    }
    setLoadingExit(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/pages/create`, data, {
        headers: {
          Authorization: `Bearer ${datakey?.token?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
        setFormValues({});
        setSeoImage(null);
        setTimeout(() => {
          navigate("/admin/page");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingExit(false);
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
          marginBottom: "10px",
          marginLeft: "10px",
        }}
      >
        {label}
        {required && <span style={redStarStyle}>*</span>}
      </InputLabel>
      <Divider flexItem />
      <FormControl
        sx={{ padding: "10px" }}
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
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "15px",
      }}
    >
      <ToastContainer />
      <Stack
        sx={{
          width: "98%",
          // maxHeight: "85%",
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
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
            <Typography
              variant="h5"
              sx={{ cursor: "pointer", color: "#895129" }}
              onClick={() =>
                navigate("/admin/page", {
                  state: { activeItem: "All Pages" },
                })
              }
            >
              Pages
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Create New Page</Typography>
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
              disabled={loading || loadingExit}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#895129" }} />
              ) : (
                "Save"
              )}
            </Button>
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
                width: { xs: "100%", sm: "auto" },
              }}
              startIcon={<ExitToAppIcon />}
              onClick={handleSaveExit}
              disabled={loading || loadingExit}
            >
              {loadingExit ? (
                <CircularProgress size={24} sx={{ color: "#895129" }} />
              ) : (
                "Save & Exit"
              )}
            </Button>
          </Box>
        </Stack>
        <Stack
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: isTabMode ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: isTabMode ? "100%" : "68%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack sx={{ padding: "15px", background: "#fff" }}>
              {renderTextField("Page Name", "pageName", "text", true)}
              {renderTextField("Title", "title", "text", true)}
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={inputLabelStyle}>
                    Content
                  </Typography>
                  <Box>
                    <Button
                      onClick={() => setActiveButton("Visual")}
                      sx={{
                        borderRadius: 0,
                        border: "1px solid #895129",
                        bgcolor:
                          activeButton === "Visual" ? "#895129" : "#FCF8E7",
                        color: activeButton === "Visual" ? "#fff" : "#895129",
                        "&:hover": {
                          backgroundColor:
                            activeButton === "Visual" ? "#895129" : "#FCF8E7",
                          border: "1px solid #895129",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Visual
                    </Button>
                    <Button
                      onClick={() => setActiveButton("HTML")}
                      sx={{
                        borderRadius: 0,
                        border: "1px solid #895129",
                        bgcolor:
                          activeButton === "HTML" ? "#895129" : "#FCF8E7",
                        color: activeButton === "HTML" ? "#fff" : "#895129",
                        "&:hover": {
                          backgroundColor:
                            activeButton === "HTML" ? "#895129" : "#FCF8E7",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      HTML
                    </Button>
                  </Box>
                </Box>
                {activeButton === "Visual" && (
                  <>
                    <ReactQuill
                      ref={quillRef}
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
                  </>
                )}
                {activeButton === "HTML" && (
                  <>
                    <TextareaAutosize
                      value={formValues.content}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        minHeight: "300px",
                        border: "1px solid #895129",
                        borderRadius: 0,
                        padding: "10px",
                        fontSize: "14px",
                        color: "#895129",
                      }}
                    />
                  </>
                )}
              </Box>
              <Box sx={{ marginTop: "50px" }}></Box>
            </Stack>
            <Stack
              sx={{
                marginTop: "10px",
                background: "#fff",
                padding: "10px 0px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "10px", marginLeft: "20px" }}
                >
                  FAQ schema configuration (Learn more)
                </Typography>
                {/* <Button
                  variant="outlined"
                  sx={{
                    marginRight: 2,
                    borderColor: "#ccc",
                    color: "#000",
                    textTransform: "none",
                  }}
                >
                  Bulk FAQs
                </Button> */}
              </Box>
              <Divider flexItem />
              <Box sx={{ padding: "10px" }}>
                {formValues.faq?.map((faq, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      marginBottom: "10px",
                      mb: 2,
                      p: 0,
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleRemove(index)}
                      sx={{
                        position: "absolute",
                        color: "#d32f2f",
                        p: 0,
                        right: "10px",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box>
                      <Grid container spacing={2} mt={0}>
                        <Grid item xs={6}>
                          <Grid item style={{ width: "100%" }}>
                            <InputLabel sx={inputLabelStyle}>
                              Question
                            </InputLabel>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              size="small"
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
                                type="text"
                                id="question"
                                name="question"
                                size="small"
                                value={faq.question}
                                onChange={(event) =>
                                  handleInputChange(index, event)
                                }
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid item style={{ width: "100%" }}>
                            <InputLabel sx={inputLabelStyle}>Answer</InputLabel>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              size="small"
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
                                type="text"
                                id="answer"
                                name="answer"
                                size="small"
                                value={faq.answer}
                                onChange={(event) =>
                                  handleInputChange(index, event)
                                }
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                ))}

                <Button
                  onClick={handleAddNew}
                  variant="outlined"
                  sx={{
                    marginRight: 2,
                    borderColor: "#895129",
                    color: "#895129",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#FCF8E7",
                      borderColor: "#895129",
                      color: "#895129",
                    },
                  }}
                >
                  Add New
                </Button>
              </Box>
            </Stack>
            <Stack
              sx={{
                background: "#fff",
                marginTop: "10px",
                padding: "10px 0px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", marginLeft: "10px" }}
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
                {renderTextField("SEO description", "metaDescription", "text")}

                <Grid container pt={2} style={{ width: "100%" }}>
                  <Grid item xs={12} style={{ width: "100%" }}>
                    <InputLabel sx={inputLabelStyle}>SEO Tag</InputLabel>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      error={!!errors.metaTags}
                    >
                      <OutlinedInput
                        fullWidth
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
                          flex: 1,
                        }}
                        error={!!errors.metaTags}
                        placeholder="Add SEO Tags"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleAddMetaTag}
                      />
                      <Button
                        variant="contained"
                        onClick={addMetaTag}
                        sx={{
                          marginLeft: "8px",
                          bgcolor: "#895129",
                          color: "#fff",
                          height: "40px",
                          "&:hover": {
                            backgroundColor: "#73411f",
                          },
                        }}
                      >
                        Add
                      </Button>
                    </FormControl>
                    {errors.metaTags && (
                      <FormHelperText sx={{ ml: 2, color: "red" }}>
                        {errors.metaTags}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  {formValues?.metaTags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteMetaTag(tag)}
                      color="primary"
                      sx={{ bgcolor: "#895129" }}
                    />
                  ))}
                </Box>
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
            <Box
              sx={{
                background: "#fff",
                // marginTop: "10px",
              }}
            >
              {renderSelectField("Status", "status", statusList, true)}
            </Box>
            <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" sx={{ marginLeft: "10px" }}>
                    Feature Image
                  </Typography>
                  <Box sx={{ padding: "10px" }}>
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
                      onClick={() => seoImageInputRef.current.click()}
                    >
                      Upload Feature image
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/svg+xml"
                        hidden
                        ref={seoImageInputRef}
                        onChange={(e) => setSeoImage(e.target.files[0])}
                      />
                    </Button>
                  </Box>
                </Box>
                {seoImage && (
                  <Box
                    sx={{
                      marginLeft: "10px",
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpenverticalPopup(true)}
                  >
                    <img
                      // src={seoImage}
                      src={seoImage ? URL.createObjectURL(seoImage) : undefined}
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
              {seoImage && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                >
                  {seoImage.name}
                </Typography>
              )}
            </Box>

            <Dialog
              open={openverticalPopup}
              onClose={() => setOpenverticalPopup(false)}
            >
              <Box sx={{ position: "relative", padding: "10px" }}>
                <IconButton
                  onClick={() => setOpenverticalPopup(false)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <Close />
                </IconButton>
                <img
                  // src={seoImage}
                  src={seoImage ? URL.createObjectURL(seoImage) : undefined}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "500px",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </Box>
            </Dialog>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(AddPage);
