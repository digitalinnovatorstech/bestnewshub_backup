import {
  Backdrop,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useState, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../services/slices/globalSlice";
import {
  getCategoryDetails,
  updateCategory,
} from "../../../services/slices/categoriesSlice";

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
  name: "",
  _parentCategories: null,
  description: "",
  status: "",
  metaTitle: "",
  metaDescription: "",
  // slug: "",
};

const statusList = [
  { id: "Published", name: "Published" },
  { id: "Draft", name: "Draft" },
];

function formatValue(value) {
  return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
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

const EditCategories = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingV, setLoadingV] = useState(false);
  const queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("id");
  const categoriesDetails = useSelector(
    (state) => state.categories.categoriesDetails
  );
  useEffect(() => {
    setLoadingV(true);
    dispatch(getCategoryDetails(categoryId)).finally(() => {
      setLoadingV(false);
    });
  }, [dispatch]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const allcategoryList = useSelector((state) => state.global.allcategoryList);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const onSelectChangeHandler = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value;

    // Recursively find the selected category and build the slug path
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
    // const slugPath = result
    //   ? `${result.path.join("/")}/${formValues.name}`
    //   : "";

    setFormValues((prevValues) => ({
      ...prevValues,
      _parentCategories: selectedCategory ? selectedCategory.id : null,
      // slug: slugPath,
    }));
  };

  // Utility function to find a category by its ID recursively
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
    if (!formValues.name) newErrors.name = "Name is required";
    // if (!formValues._parentCategories)
    //   newErrors._parentCategories = "Parent Categories is required";
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
    // Filter out only the changed values
    const changedValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] !== updatedFormValues[key]) {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
    try {
      setLoading(true);
      await dispatch(updateCategory({ categoryId, changedValues })).unwrap();
      setFormValues({});
      setTimeout(() => {
        navigate("/admin/categories");
      }, 1000);
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

  const updatedFormValues = deepCopyFormValues(categoriesDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
      // _parentCategories: categoriesDetails?.Categories?.[0]?.id,
      metaTags: categoriesDetails?.metaTags?.split(",") || [],
    }));
  }, [categoriesDetails]);
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
              onClick={() => navigate("/admin/categories")}
            >
              Categories
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Update Categories</Typography>
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
              padding: "15px",
              background: "#fff",
            }}
          >
            {renderTextField("Name", "name", "text", true)}

            {/* {formValues._parentCategories !== null && ( */}
            <Box
              sx={{
                background: "#fff",
                marginTop: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "2px", marginLeft: "2px" }}
              >
                Parent Category
                {/* <span style={redStarStyle}>*</span> */}
              </Typography>
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors._parentCategories}
              >
                <select
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #895129",
                    fontSize: "14px",
                    "&:hover": { border: "1px solid #895129" },
                  }}
                  // value={
                  //   formValues._parentCategories
                  //     ? allcategoryList.find(
                  //         (cat) => cat.id === formValues._parentCategories
                  //       )?.slug || ""
                  //     : ""
                  // }
                  value={
                    formValues._parentCategories
                      ? findCategoryById(
                          allcategoryList,
                          formValues._parentCategories
                        )?.slug || ""
                      : ""
                  }
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a category</option>
                  {renderCategories(allcategoryList)}
                </select>
                {errors._parentCategories && (
                  <FormHelperText>{errors._parentCategories}</FormHelperText>
                )}
              </FormControl>
            </Box>
            {/* )} */}
            <Grid item xs={12}>
              <Stack sx={{ pt: 2 }}>
                <InputLabel sx={inputLabelStyle}>Description</InputLabel>
                <TextField
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: "0.8rem",
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
                  id="description"
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Add description here"
                  value={formValues?.description || ""}
                  onChange={(e) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      description: e.target.value,
                    }))
                  }
                />
              </Stack>
            </Grid>
            {/* {renderTextField("Icon", "description", "text")} */}
            <Stack
              sx={{
                border: "1px solid #ccc",
                background: "#fff",
                marginTop: "15px",
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
                    marginLeft: "10px",
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
              }}
            >
              {renderSelectField("Status", "status", statusList, true)}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(EditCategories);
