import {
  Backdrop,
  Box,
  Button,
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
import { useState, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { useDispatch, useSelector } from "react-redux";
import { getTagDetails, updateTag } from "../../../services/slices/tagSlice";

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
  description: "",
  status: "",
  metaTitle: "",
  metaDescription: "",
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

const EditTag = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingV, setLoadingV] = useState(false);
  const tagId = localStorage.getItem("tagId");
  const tagDetails = useSelector((state) => state.tag.tagDetails);
  useEffect(() => {
    setLoadingV(true);
    dispatch(getTagDetails(tagId)).finally(() => {
      setLoadingV(false);
    });
  }, [dispatch]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.status) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const changedValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] !== updatedFormValues[key]) {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
    setLoading(true);
    try {
      await dispatch(updateTag({ tagId, changedValues })).unwrap();
      setFormValues({});
      setTimeout(() => {
        navigate("/admin/tags");
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

  const updatedFormValues = deepCopyFormValues(tagDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
  }, [tagDetails]);

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
              onClick={() => navigate("/admin/tags")}
            >
              Tags
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Create New Tags</Typography>
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
                "update"
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
              {renderTextField("Name", "name", "text", true)}
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
            </Stack>
            <Stack
              sx={{
                background: "#fff",
                marginTop: "15px",
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
                    marginLeft: "20px",
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
                marginTop: isTabMode ? "10px" : "0px",
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

export default memo(EditTag);
