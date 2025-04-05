import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, memo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, Image, Close } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  getAllTags,
} from "../../../services/slices/globalSlice";
import axios from "axios";
import { getPostDetails } from "../../../services/slices/postSlice";
import moment from "moment/moment";

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

// const homelayoutList = [
//   { id: "INTERNATIONAL", name: "International" },
//   { id: "NATIONAL", name: "National" },
//   { id: "SHORT", name: "Short" },
//   { id: "FEATURED", name: "Featured" },
//   { id: "EASY_SEARCH", name: "Easy Search" },
// ];

// const categorylayoutList = [
//   { id: "TOP POST", name: "Inherit" },
//   { id: "Post Right Side Bar", name: "Post Right Side Bar" },
//   { id: "Post Left Side Bar", name: "Post Left Side Bar" },
//   { id: "Post Full Width", name: "Post Full Width" },
// ];

const statusList = [
  { id: "Published", name: "Published" },
  { id: "Pending", name: "Pending" },
];

function formatValue(value) {
  return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
}

function formatDate(dateString) {
  return moment(dateString).format("YYYY-MM-DD");
}

function deepCopyFormValues(UserDetails, formValues) {
  function deepCopy(target, source) {
    for (let key in source) {
      if (source[key] && typeof source[key] === "object") {
        if (Array.isArray(source[key])) {
          target[key] = [...source[key]];
        } else {
          if (!target[key]) target[key] = {};
          deepCopy(target[key], source[key]);
        }
      } else {
        if (key === "status") {
          target[key] = formatValue(source[key]);
        } else if (key === "publishedAt") {
          target[key] = formatDate(source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  let copiedFormValue = JSON.parse(JSON.stringify(formValues));
  deepCopy(copiedFormValue, UserDetails);
  return copiedFormValue;
}

const EditPosts = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postId = localStorage.getItem("postId");
  const [loadingV, setLoadingV] = useState(false);
  const postDetails = useSelector((state) => state.post.postDetails);
  // const catId = postDetails?.Categories?.[0]?.id;
  const allcategoryList = useSelector((state) => state.global.allcategoryList);
  const allTagList = useSelector((state) => state.global.allTagList);

  useEffect(() => {
    setLoadingV(true);
    dispatch(getPostDetails(postId)).finally(() => {
      setLoadingV(false);
    });
    dispatch(getAllCategories());
    dispatch(getAllTags());
  }, [dispatch]);
  const quillRef = useRef(null);
  const [formValues, setFormValues] = useState({
    title: "",
    tempPermalink: "",
    showingCategies: "",
    permalink: "",
    content: "",
    layout: "",
    status: "",
    categoryIds: "",
    tagIds: [],
    homeLayout: "",
    categoryLayout: "",
    faq: [],
    metaTitle: "",
    metaDescription: "",
    metaTags: [],
    isPublished: "",
    isIndex: "",
    publishedAt: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("Visual");
  // const [verticalImage, setverticalImage] = useState(null);
  // const [openverticalPopup, setOpenverticalPopup] = useState(false);
  // const verticalImageInputRef = useRef(null);
  const [horizontalImage, sethorizontalImage] = useState(null);
  const [openhorizontalPopup, setOpenhorizontalPopup] = useState(false);
  const horizontalImageInputRef = useRef(null);
  // const [squareImage, setsquareImage] = useState(null);
  // const [opensquarePopup, setOpensquarePopup] = useState(false);
  // const squareImageInputRef = useRef(null);

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
      const tempLink = value
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const categorySlug = formValues.showingCategies
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-/]/g, "");

      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        tempPermalink: tempLink,
        permalink: `${categorySlug}/${tempLink}`,
      }));
      return;
    }

    if (name === "tempPermalink") {
      setFormValues((prevValues) => {
        const categorySlug = prevValues.showingCategies
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-/]/g, "");

        const link = value
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-_]/g, "");

        return {
          ...prevValues,
          [name]: value
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-/]/g, ""),
          permalink: `${categorySlug}/${link}`,
        };
      });

      return;
    }

    if (name === "showingCategies") {
      setFormValues((prevValues) => {
        const categorySlug = value
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-/]/g, "");

        return {
          ...prevValues,
          [name]: value,
          permalink: `${categorySlug}/${prevValues.tempPermalink}`,
        };
      });

      return;
    }

    if (name === "publishedAt") {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Publish date cannot be in the future.",
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
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // category
  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value;

    const findCategoryBySlug = (categories, slug, path = []) => {
      for (let category of categories) {
        if (category.slug === slug) {
          return { category, path: [...path, category.slug] };
        }
        if (category.children && category.children.length > 0) {
          const result = findCategoryBySlug(category.children, slug, [
            ...path,
            category.slug,
          ]);
          if (result) return result;
        }
      }
      return null;
    };

    const result = findCategoryBySlug(allcategoryList, selectedSlug);
    const selectedCategory = result?.category || null;
    const slugPath = result
      ? `${selectedCategory?.slug}/${formValues.tempPermalink}`
      : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      categoryIds: selectedCategory ? selectedCategory.id : null,
      permalink: slugPath
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
      showingCategies: selectedCategory?.slug,
      //   ?.substring(
      //   0,
      //   selectedCategory?.slug?.lastIndexOf("/")
      // ),
    }));

    setErrors((prevErrors) => ({ ...prevErrors, categoryIds: "" }));
  };
  const findCategoryById = (categories, id) => {
    for (let category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const result = findCategoryById(category.children, id);
        if (result) return result;
      }
    }
    return null;
  };
  const renderCategories = (categories, depth = 0) => {
    if (!categories || categories.length === 0) {
      return <option disabled>Loading...</option>;
    }

    return categories.map((category) => {
      const prefix = "\u00A0\u00A0\u00A0- ".repeat(depth);
      let options = [
        <option key={category.id} value={category.slug}>
          {`${prefix}${category.name}`}
        </option>,
      ];
      if (category.children && category.children.length > 0) {
        options = options.concat(
          renderCategories(category.children, depth + 1)
        );
      }

      return options;
    });
  };

  // for tag
  const handleTagChange = (event, value) => {
    const selectedTagIds = value?.map((tag) => tag.id);
    setFormValues((prevValues) => ({
      ...prevValues,
      tagIds: selectedTagIds,
    }));
  };
  const selectedTags = allTagList.filter((tag) =>
    formValues.tagIds?.includes(tag.id)
  );

  // for meta tag
  const [inputValue, setInputValue] = useState("");
  const addMetaTag = () => {
    if (
      inputValue.trim() !== "" &&
      !formValues?.metaTags?.includes(inputValue.trim())
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
    if (!formValues.title) newErrors.title = "Post Title is required";
    if (!formValues.permalink) newErrors.permalink = "Permalink is required";
    if (!formValues.status) newErrors.status = "Status is required";
    if (!formValues.metaTitle) newErrors.metaTitle = "SEO Title is required";
    if (!formValues.metaDescription)
      newErrors.metaDescription = "SEO Descriptions is required";
    if (!formValues.metaTags || formValues?.metaTags?.length === 0)
      newErrors.metaTags = "At least one SEO Tag is required";
    // if (!formValues.categoryIds) newErrors.categoryIds = "category is required";
    // if (!formValues.tagIds) newErrors.tagIds = "Tag is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {};
    Object.keys(formValues).forEach((key) => {
      // if (formValues[key] !== postDetails[key]) {
      //   payload[key] = formValues[key];
      // }
      if (key === "faq") {
        payload.faq = JSON.stringify(formValues.faq);
      } else {
        payload[key] = formValues[key];
      }
    });
    // if (verticalImage) {
    //   payload.verticalImageUrl = verticalImage;
    // }
    if (horizontalImage) {
      payload.verticalImageUrl = horizontalImage;
    }
    if (horizontalImage) {
      payload.SEOImageUrl = horizontalImage;
    }
    if (horizontalImage) {
      payload.squareImageUrl = horizontalImage;
    }
    // if (squareImage) {
    //   payload.squareImageUrl = squareImage;
    // }
    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.");
      setLoading(false);
      return;
    }
    const data = new FormData();
    Object.keys(payload).forEach((key) => {
      data.append(key, payload[key]);
    });
    // const data = new FormData();
    // Object.keys(formValues).forEach((key) => {
    //   data.append(key, formValues[key]);
    // });
    // if (verticalImage) {
    //   data.append("verticalImageUrl", verticalImage);
    // }
    // if (horizontalImage) {
    //   data.append("SEOImageUrl", horizontalImage);
    // }
    // if (squareImage) {
    //   data.append("squareImageUrl", squareImage);
    // }
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/admin/posts/update/${postId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${datakey?.token?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setFormValues({});
      // setSeoImage(null);
      // setverticalImage(null);
      sethorizontalImage(null);
      // setsquareImage(null);
      setTimeout(() => {
        navigate("/admin/posts");
      }, 2000);
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

  const updatedFormValues = deepCopyFormValues(postDetails, formValues);
  useEffect(() => {
    const updatedTagIds = postDetails?.Tags?.map((tag) => tag.id) || [];
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
      categoryIds: postDetails?.Categories?.[0]?.id,
      // tagIds: postDetails?.Tags?.[0]?.id,
      tagIds: updatedTagIds,
      metaTags: postDetails?.metaTags?.split(",") || [],
      tempPermalink:
        postDetails?.tempPermalink ||
        `${postDetails?.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/[^a-z0-9]+$/g, "")}`,
      showingCategies:
        postDetails?.showingCategies ||
        postDetails?.Categories?.[0]?.slug?.replace(/\d+/g, ""),
      faq: postDetails?.FAQ,
    }));
    // if (postDetails && postDetails.verticalImageUrl) {
    //   setverticalImage(postDetails.verticalImageUrl);
    // }
    if (postDetails && postDetails.SEOImageUrl) {
      sethorizontalImage(postDetails.SEOImageUrl);
    }
    // if (postDetails && postDetails.squareImageUrl) {
    //   setsquareImage(postDetails.squareImageUrl);
    // }
  }, [postDetails]);

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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingV}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Stack
        sx={{
          width: "98%",
          flex: 1,
          // maxHeight: "85%",
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9F9F9",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography
              variant="h5"
              sx={{ cursor: "pointer", color: "#895129" }}
              onClick={() => navigate("/admin/posts")}
            >
              Posts
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Update Post</Typography>
          </Box>
          <Box sx={{}}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#895129",
                },
              }}
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#895129" }} />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Stack>
        <Stack
          sx={{
            // width: "98%",
            // maxHeight: "35%",
            // overflow: "auto",
            marginTop: "10px",
            display: "flex",
            flexDirection: isTabMode ? "column" : "row",
            // flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              // width: "68%",
              width: isTabMode ? "100%" : "68%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack sx={{ padding: "15px", background: "#fff" }}>
              {renderTextField("Post Title", "title", "text", true)}
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "2px", marginLeft: "2px" }}
                >
                  Category<span style={redStarStyle}>*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.categoryIds}
                >
                  <select
                    style={{
                      padding: "10px",
                      width: "100%",
                      borderRadius: "4px",
                      border: "1px solid #895129",
                      fontSize: "14px",
                      "&:hover": { border: "1px solid #895129" },
                      // "& .MuiInputBase-input::placeholder": {
                      //   fontSize: "0.8rem",
                      //   color: "#895129",
                      // },
                      // "& .MuiOutlinedInput-notchedOutline": {
                      //   borderColor: "#895129",
                      // },
                      // "&:hover .MuiOutlinedInput-notchedOutline": {
                      //   borderColor: "#895129",
                      // },
                      // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      //   borderColor: "#895129",
                      // },
                    }}
                    value={
                      formValues.categoryIds
                        ? findCategoryById(
                            allcategoryList,
                            formValues.categoryIds
                          )?.slug || ""
                        : ""
                    }
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {renderCategories(allcategoryList)}
                  </select>
                  {errors.categoryIds && (
                    <FormHelperText>{errors.categoryIds}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              {renderTextField("Permalink", "tempPermalink", "text", true)}
              <FormHelperText>
                {`${import.meta.env.VITE_API_LANDING_URL}/`}
                {formValues?.showingCategies
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-")}
              </FormHelperText>
              <Box
                sx={{
                  marginTop: "5px",
                  marginBottom: "15px",
                  borderRadius: "8px",
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
                      // modules={{
                      //   toolbar: [
                      //     // [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      //     [{ list: "ordered" }, { list: "bullet" }],
                      //     ["bold", "italic", "underline", "strike"],
                      //     [
                      //       { list: "ordered" },
                      //       { list: "bullet" },
                      //       { list: "check" },
                      //     ],
                      //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
                      //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                      //     [{ direction: "rtl" }],
                      //     [{ align: [] }],
                      //     [{ color: [] }, { background: [] }],
                      //     ["blockquote"],
                      //     ["link", "image"], // Use default image button
                      //   ],
                      //   // handlers: {
                      //   //   'image': customImageHandler,
                      //   // },
                      // }}
                      // formats={[
                      //   // "header",
                      //   "list",
                      //   "indent",
                      //   "script",
                      //   "bold",
                      //   "italic",
                      //   "underline",
                      //   "strike",
                      //   "align",
                      //   "color",
                      //   "background",
                      //   "blockquote",
                      //   "link",
                      //   "image",
                      // ]}
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
              {/* <Box sx={{ padding: "10px" }}>
                {postDetails?.faq?.length > 0 &&
                  postDetails?.faq?.map((faq) => (
                    <Accordion
                      key={faq.id}
                      sx={{ marginBottom: 2, boxShadow: 3 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="textSecondary">
                          {faq.answer}
                        </Typography>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </Box> */}
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
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box>
                      <Grid container spacing={2} mt={1}>
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

                {/* <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "inline-block", mr: 1 }}
                  >
                    or
                  </Typography>
                  <Link href="#" underline="hover">
                    Select from existing FAQs
                  </Link>
                </Box> */}
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
                    // marginLeft: "20px",
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
              // width: "30%",
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
                padding: "10px",
              }}
            >
              {renderTextField("Publish Date", "publishedAt", "date")}
            </Box>
            <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", marginLeft: "20px" }}
              >
                Tag<span style={redStarStyle}>*</span>
              </Typography>
              <Divider flexItem />
              <Box sx={{ padding: "10px" }}>
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
                    error={errors.tagIds ? true : undefined}
                    value={selectedTags}
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
            {/* <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
              }}
            >
              {renderSelectField("Layout", "homeLayout", homelayoutList)}
            </Box> */}

            {/* <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                    Vertical Image
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
                      onClick={() => verticalImageInputRef.current.click()}
                    >
                      Choose image
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/svg+xml"
                        hidden
                        ref={verticalImageInputRef}
                        onChange={(e) => setverticalImage(e.target.files[0])}
                      />
                    </Button>
                  </Box>
                </Box>
                {verticalImage && (
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
                      src={
                        verticalImage instanceof File
                          ? URL.createObjectURL(verticalImage)
                          : verticalImage
                      }
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
              {verticalImage && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                >
                  {typeof verticalImage === "object"
                    ? verticalImage.name
                    : verticalImage?.split("/").pop() || "no name"}
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
                  src={
                    verticalImage instanceof File
                      ? URL.createObjectURL(verticalImage)
                      : verticalImage
                  }
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
            </Dialog> */}

            <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                }}
              >
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
                      onClick={() => horizontalImageInputRef.current.click()}
                    >
                      Choose image
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/svg+xml"
                        multiple
                        hidden
                        ref={horizontalImageInputRef}
                        onChange={(e) => sethorizontalImage(e.target.files[0])}
                      />
                    </Button>
                  </Box>
                </Box>
                {horizontalImage && (
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
                    onClick={() => setOpenhorizontalPopup(true)}
                  >
                    <img
                      src={
                        horizontalImage instanceof File
                          ? URL.createObjectURL(horizontalImage)
                          : horizontalImage
                      }
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
              {/* {horizontalImage && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                >
                  {horizontalImage?.split("/").pop() || "no name"}
                </Typography>
              )} */}

              {horizontalImage && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                >
                  {typeof horizontalImage === "object"
                    ? horizontalImage.name
                    : horizontalImage?.split("/").pop() || "no name"}
                </Typography>
              )}
            </Box>
            <Dialog
              open={openhorizontalPopup}
              onClose={() => setOpenhorizontalPopup(false)}
            >
              <Box sx={{ position: "relative", padding: "10px" }}>
                <IconButton
                  onClick={() => setOpenhorizontalPopup(false)}
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
                  src={
                    horizontalImage instanceof File
                      ? URL.createObjectURL(horizontalImage)
                      : horizontalImage
                  }
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

            {/* <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                    Square Image
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
                  </Box>
                </Box>
                {squareImage && (
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
                    onClick={() => setOpensquarePopup(true)}
                  >
                    <img
                      src={
                        squareImage instanceof File
                          ? URL.createObjectURL(squareImage)
                          : squareImage
                      }
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
              {squareImage && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                >
                  {typeof squareImage === "object"
                    ? squareImage.name
                    : squareImage?.split("/").pop() || "no name"}
                </Typography>
              )}
            </Box>
            <Dialog
              open={opensquarePopup}
              onClose={() => setOpensquarePopup(false)}
            >
              <Box sx={{ position: "relative", padding: "10px" }}>
                <IconButton
                  onClick={() => setOpensquarePopup(false)}
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
                  src={
                    squareImage instanceof File
                      ? URL.createObjectURL(squareImage)
                      : squareImage
                  }
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
            </Dialog> */}

            {/* <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                Vertical Image
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CloudUploadIcon sx={{ marginRight: "5px" }} />
                      {verticalImage.name}
                    </div>
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                Horizontal Image
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
                  onClick={() => horizontalImageInputRef.current.click()}
                >
                  Choose image
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/svg+xml"
                    multiple
                    hidden
                    ref={horizontalImageInputRef}
                    onChange={(e) => sethorizontalImage(e.target.files[0])}
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CloudUploadIcon sx={{ marginRight: "5px" }} />
                      {horizontalImage.name}
                    </div>
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                background: "#fff",
                marginTop: "5px",
                padding: "10px 0px",
              }}
            >
              <Typography variant="h6" sx={{ marginLeft: "20px" }}>
                Square Image
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CloudUploadIcon sx={{ marginRight: "5px" }} />
                      {squareImage.name}
                    </div>
                  </Typography>
                )}
              </Box>
            </Box> */}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(EditPosts);
