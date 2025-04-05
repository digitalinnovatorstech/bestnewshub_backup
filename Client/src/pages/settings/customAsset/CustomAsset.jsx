import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { memo, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomAsset,
  deleteCustomAsset,
  getCustomAssetList,
} from "../../../services/slices/globalSlice";
import {
  Delete,
  EditNote,
  InfoOutlined,
  Save,
  Update,
} from "@mui/icons-material";

const inputLabelStyle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: "3px",
};

const initialFormValues = {
  customCSS: "",
  customJS: "",
  id: "",
};

function formatValue(value) {
  return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
}

function deepCopyFormValues(Details, formValues) {
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
  deepCopy(copiedFormValue, Details);
  return copiedFormValue;
}

const CustomAsset = () => {
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [loadingList, setLoadingList] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const customAssetList = useSelector((state) => state.global.customAssetList);

  useEffect(() => {
    setLoadingList(true);
    dispatch(getCustomAssetList()).finally(() => {
      setLoadingList(false);
    });
  }, [dispatch]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(addCustomAsset(formValues)).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        setFormValues({
          customCSS: "",
          customJS: "",
          id: "",
        });
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    let transformedData;
    if (item) {
      transformedData = {
        name: item?.name,
        src: item?.src,
        script: item?.customJS,
        active: item?.active,
      };
      if (typeof item.customCSS == "object") {
        css = JSON.stringify(transformedData);
      }
      setFormValues({
        ...formValues,
        customJS: JSON.stringify(transformedData),
        // customCSS:
        //   typeof item.customCSS == "object"
        //     ? JSON.stringify(item.customCSS)
        //     : item.customCSS,

        customCSS: item.customCSS,
        id: item.id,
      });
    }
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedDeleteItem(null);
  };
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    if (selectedDeleteItem) {
      try {
        const response = await dispatch(
          deleteCustomAsset(selectedDeleteItem.id)
        ).unwrap();
        if (response.success == true) {
          toast.success("Deleted successfully!", { position: "top-right" });
        } else {
          toast.error(response?.message || "Failed to delete item!", {
            position: "top-right",
          });
        }
      } catch (error) {
        toast.error(error?.message || "Failed to delete item!", {
          position: "top-right",
        });
      }
    }
    setDeleteLoading(false);
    handleCloseDelete();
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "95vh",
        display: "flex",
        overflow: "hidden",
        padding: "15px",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingList}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <ToastContainer />
      <Stack
        sx={{
          width: "98%",
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
            >
              Settings
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Custom Asset</Typography>
          </Box>
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: isTabMode ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: isTabMode ? "100%" : "70%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid item xs={12}>
              <Stack sx={{ pt: 2 }}>
                {/* <InputLabel sx={inputLabelStyle}>
                  Custom CSS (Without style tag)
                </InputLabel> */}

                <InputLabel sx={inputLabelStyle}>
                  Custom CSS (Without style tag)
                  <Tooltip
                    title={
                      <Box sx={{ p: 1, maxWidth: 300 }}>
                        <Typography variant="body2">
                          Enter CSS code without using the{" "}
                          <code>{`<style>`}</code> tag.
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          Example:
                        </Typography>
                        <Box
                          component="pre"
                          sx={{
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            fontSize: "0.75rem",
                            padding: "4px",
                            borderRadius: "4px",
                            overflowX: "auto",
                          }}
                        >
                          {`{
  "selector": "body",
  "rules": "background-color: #f0f0f0; color: #333;"
}`}
                        </Box>
                      </Box>
                    }
                    arrow
                  >
                    <InfoOutlined
                      sx={{
                        fontSize: 18,
                        marginLeft: 0.5,
                        cursor: "pointer",
                        color: "#555",
                      }}
                    />
                  </Tooltip>
                </InputLabel>

                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.customCSS}
                >
                  <TextField
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: "monospace",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "0.8rem",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                    }}
                    id="description"
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Enter your CSS here"
                    value={formValues?.customCSS || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        customCSS: value,
                      }));
                      if (errors.customCSS) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customCSS: "",
                        }));
                      }
                    }}
                    error={!!errors.customCSS}
                  />
                  {errors.customCSS && (
                    <FormHelperText>{errors.customCSS}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ pt: 2 }}>
                <InputLabel sx={inputLabelStyle}>
                  Custom JS (Without script tag)
                  <Tooltip
                    title={
                      <Box sx={{ p: 1, maxWidth: 300 }}>
                        <Typography variant="body2">
                          Enter JavaScript code without using the{" "}
                          <code>{`<script>`}</code> tag.
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          Example:
                        </Typography>
                        <Box
                          component="pre"
                          sx={{
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            fontSize: "0.75rem",
                            padding: "4px",
                            borderRadius: "4px",
                            overflowX: "auto",
                          }}
                        >
                          {`{
  "name": "Google Ads",
  "src": "https://www.googletagmanager.com/gtag/js?id=AW-12XXXXXX",
  "script": "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('event', 'conversion', {'send_to': 'AW-12XXXXX'});"
}`}
                        </Box>
                      </Box>
                    }
                    arrow
                  >
                    <InfoOutlined
                      sx={{
                        fontSize: 18,
                        marginLeft: 0.5,
                        cursor: "pointer",
                        color: "#555",
                      }}
                    />
                  </Tooltip>
                </InputLabel>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.customJS}
                >
                  <TextField
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: "monospace",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "0.8rem",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                    }}
                    id="description"
                    multiline
                    rows={8}
                    variant="outlined"
                    // placeholder="Enter your JavaScript here"
                    placeholder={`Enter your JavaScript here `}
                    value={formValues?.customJS || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        customJS: value,
                      }));
                      if (errors.customJS) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customJS: "",
                        }));
                      }
                    }}
                    error={!!errors.customJS}
                  />
                  {errors.customJS && (
                    <FormHelperText>{errors.customJS}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                mt: 1,
              }}
            >
              {" "}
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
                startIcon={isEdit ? <Update /> : <Save />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#895129" }} />
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Stack>
          <Stack
            sx={{
              ml: { xs: 0, md: 2 },
              width: isTabMode ? "100%" : "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {customAssetList?.map((item) => (
              <Card
                key={item.id}
                sx={{ mt: 2, p: 1, boxShadow: 3, borderRadius: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {item.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#895129",
                        fontWeight: "bold",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => handleEdit(item)}
                    >
                      <EditNote />
                    </IconButton>

                    <IconButton
                      size="small"
                      sx={{
                        color: "#c62828",
                        fontWeight: "bold",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => {
                        setSelectedDeleteItem(item);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  // color="text.secondary"
                  sx={{
                    mt: 1,
                    textDecoration: "underline",
                  }}
                >
                  JS Details:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    src:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.src}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Script:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.customJS}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textDecoration: "underline",
                  }}
                >
                  CSS Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                >
                  {item.customCSS || "No custom CSS provided"}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Status:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Stack>
        </Stack>
        <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Custom JS and CSS entry?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="secondary">
              Cancel
            </Button>
            <Button
              color="error"
              autoFocus
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              startIcon={
                deleteLoading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : null
              }
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default memo(CustomAsset);
