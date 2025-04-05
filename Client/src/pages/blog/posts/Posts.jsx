import { memo, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Drawer,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  BulkPostApprove,
  BulkPostDelete,
  BulkPostReject,
  getPostList,
} from "../../../services/slices/postSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginatedTable from "../../../components/table/PaginatedTable";
import PostColumns from "./PostTableColumn";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";

const statusList = [
  { id: "Published", name: "Published" },
  { id: "Pending", name: "Pending" },
  { id: "Rejected", name: "Rejected" },
  { id: "Draft", name: "Draft" },
];

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingT, setLodingT] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilterIcon, setShowFilterIcon] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const [formValues, setFormValues] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const payload = {
    params: {
      currentPage: paginationModel.page,
      perPage: paginationModel.pageSize,
      searchQuery: "",
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      status: formValues.status,
    },
  };
  const postStore = useSelector((state) => state.post);
  const postList = postStore.postList;
  const [filteredList, setFilteredList] = useState(postList || []);
  useEffect(() => {
    setFilteredList(postList);
  }, [postList]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [BulkOpertions, setBulkOpertions] = useState("Bulk");
  const [openDialog, setOpenDialog] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [BulkOpertionsLoading, setBulkOpertionsLoading] = useState(false);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setBulkOpertions(selectedValue);

    if (
      selectedValue === "Delete" ||
      selectedValue === "Approve" ||
      selectedValue === "Reject"
    ) {
      setOperationType(selectedValue);
      setOpenDialog(true);
    }
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredList?.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
    setSelectAll(event.target.checked);
  };

  const handleRowCheckboxChange = (rowId) => {
    const newSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];

    setSelectedRows(newSelectedRows);
  };

  const deletePayload = {
    ids: selectedRows,
  };

  const approvePayload = {
    ids: selectedRows,
    status: "PUBLISHED",
  };
  const rejectPayload = {
    ids: selectedRows,
    status: "REJECTED",
  };

  const handleBulkDelete = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkPostDelete(deletePayload)).unwrap();
      await dispatch(getPostList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkApprove = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkPostApprove(approvePayload)).unwrap();
      await dispatch(getPostList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkReject = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkPostReject(rejectPayload)).unwrap();
      await dispatch(getPostList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };

  //search
  const handleSearchChange = async () => {
    if (!searchValue) return;
    try {
      setShowCloseIcon(true);
      payload.params = {
        ...payload.params,
        searchQuery: searchValue.trim(),
        currentPage: 1,
      };
      await fetchData();
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };
  const searchClose = async () => {
    payload.params = {
      ...payload.params,
      searchQuery: "",
      currentPage: 1,
    };
    await fetchData();
    setSearchValue("");
    setShowCloseIcon(false);
  };

  // filter
  const filterOpen = () => {
    setOpen(true);
  };
  const filterClose = async () => {
    const clearedValues = {
      startDate: "",
      endDate: "",
      status: "",
    };
    setFormValues(clearedValues);
    payload.params = {
      ...payload.params,
      ...clearedValues,
      currentPage: 1,
    };
    await fetchData();
    setShowFilterIcon(false);
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      startDate: newStartDate,
    }));

    if (newStartDate >= formValues.endDate) {
      setFormValues((prevValues) => ({
        ...prevValues,
        endDate: "",
      }));
    }
  };
  const handleEndDateChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      endDate: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    (payload.params.currentPage = 1),
      (payload.params.startDate = formValues.startDate),
      (payload.params.endDate = formValues.endDate),
      (payload.params.status = formValues.status),
      await fetchData();
    setOpen(false);
    setShowFilterIcon(true);
  };

  const fetchData = async (e) => {
    const { target } = e || {};
    const isSearch = target?.name === "search";

    if (isSearch) {
      setSearchValue(target.value);
      payload.params.searchQuery = target.value.trim();
    }

    setLodingT(true);
    try {
      await dispatch(getPostList(payload));
    } catch {
      toast.error("Error fetching data");
    } finally {
      setLodingT(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  useEffect(() => {
    setTotalCount(postStore?.paginationModel?.totalItems || 0);
  }, [postStore.paginationModel]);

  const handlePaginationChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPaginationModel({
      page: 1,
      pageSize: newPageSize,
    });
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "92vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Stack
        sx={{
          // background: "#fff",
          flex: 1,
          width: "98%",
          // maxHeight: "75%",
          overflow: "auto",
          marginTop: { xs: "10px", sm: "15px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "", sm: "center" },
            alignContent: { xs: "", sm: "center" },
            gap: { xs: 1, sm: 0 },
            padding: { xs: "3px 7px", sm: "10px 20px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                mr: 1,
                width: 210,
                background: "#fff",
                borderRadius: "10px",
              }}
            >
              <OutlinedInput
                type={"text"}
                placeholder="Enter Post Title"
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchChange();
                  }
                }}
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
                endAdornment={
                  <InputAdornment
                    position="end"
                    sx={{ cursor: "pointer" }}
                    onClick={showCloseIcon ? searchClose : handleSearchChange}
                  >
                    {showCloseIcon ? (
                      <CloseIcon sx={{ color: "#895129" }} />
                    ) : (
                      <SearchIcon sx={{ color: "#895129" }} />
                    )}
                  </InputAdornment>
                }
              />
            </FormControl>
            <IconButton
              sx={{
                backgroundColor: "#895129",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#895129" },
              }}
              onClick={showFilterIcon ? filterClose : filterOpen}
            >
              {showFilterIcon ? (
                <FilterListOffIcon sx={{ color: "#fff" }} />
              ) : (
                <FilterListIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
              <Box
                p={3}
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: "400px" },
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Filter
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      gap: 1,
                      padding: 0,
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Start Date
                      </Typography>
                      <TextField
                        type="date"
                        value={formValues.startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: {
                            padding: "0px",
                            height: "40px",
                            lineHeight: "normal",
                          },
                        }}
                        sx={{
                          flex: 1,
                          padding: "6.5px 1px",
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
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        End Date
                      </Typography>
                      <TextField
                        type="date"
                        value={formValues.endDate}
                        onChange={handleEndDateChange}
                        inputProps={{
                          min: formValues.startDate,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: {
                            padding: "0px",
                            height: "40px",
                            lineHeight: "normal",
                          },
                        }}
                        sx={{
                          flex: 1,
                          padding: "6.5px 1px",
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
                        disabled={formValues.startDate === ""}
                      />
                    </Box>
                  </Box>
                  <Grid container spacing={2} pt={2}>
                    <Grid item style={{ width: "100%" }}>
                      <Typography variant="h6" gutterBottom>
                        Status
                      </Typography>
                      <FormControl variant="outlined" fullWidth size="small">
                        <SingleSelect
                          placeholder={"Select"}
                          width={"100%"}
                          value={formValues?.status || ""}
                          data={statusList}
                          onChange={(e) =>
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              status: e,
                            }))
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "20px",
                      padding: "7px 25px",
                      bgcolor: "#895129",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#895129",
                      },
                    }}
                    onClick={handleSubmit}
                    disabled={loadingT}
                  >
                    {loadingT ? (
                      <CircularProgress size={24} sx={{ color: "#895129" }} />
                    ) : (
                      "Filter"
                    )}
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {selectedRows.length > 0 && (
              <FormControl
                sx={{
                  width: "60%",
                  mr: { xs: 1, sm: 2 },
                }}
              >
                <Select
                  value={BulkOpertions}
                  onChange={handleSelectChange}
                  sx={{
                    height: "40px",
                    width: "100%",
                    color: "#895129",
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
                >
                  <MenuItem value="Bulk">Bulk Operations</MenuItem>
                  <MenuItem value="Approve">Approve</MenuItem>
                  <MenuItem value="Reject">Reject</MenuItem>
                  <MenuItem value="Delete">Delete</MenuItem>
                </Select>
              </FormControl>
            )}
            <Dialog open={openDialog}>
              <DialogTitle>
                {operationType === "Delete"
                  ? "Confirm Delete"
                  : operationType === "Approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </DialogTitle>
              <DialogContent>
                {operationType === "Delete"
                  ? "Are you sure you want to delete the selected item(s)?"
                  : operationType === "Approve"
                  ? "Are you sure you want to approve the selected item(s)?"
                  : "Are you sure you want to reject the selected item(s)?"}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    setSelectedRows([]);
                    setBulkOpertions("Bulk");
                  }}
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
                >
                  Cancel
                </Button>
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
                  onClick={
                    operationType === "Delete"
                      ? handleBulkDelete
                      : operationType === "Approve"
                      ? handleBulkApprove
                      : handleBulkReject
                  }
                  disabled={BulkOpertionsLoading}
                >
                  {BulkOpertionsLoading ? (
                    <CircularProgress size={24} sx={{ color: "#895129" }} />
                  ) : operationType === "Delete" ? (
                    "Delete"
                  ) : operationType === "Approve" ? (
                    "Approve"
                  ) : (
                    "Reject"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/admin/posts/addPosts", {
                  state: { activeItem: "New Post" },
                })
              }
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#895129",
                },
              }}
            >
              Create
            </Button>
          </Box>
        </Box>

        <Box sx={{ padding: { xs: "3px 7px", sm: "10px 20px" } }}>
          <PaginatedTable
            height={600}
            columns={PostColumns()}
            rows={filteredList || []}
            loading={loadingT}
            setLoading={setLodingT}
            totalPages={Math.ceil(totalCount / paginationModel.pageSize)}
            page={paginationModel.page}
            totalData={postStore?.paginationModel?.totalItems}
            onPageChange={handlePaginationChange}
            rowsPerPage={paginationModel.pageSize}
            handleRowsPerPageChange={handleRowsPerPageChange}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            handleSelectAllChange={handleSelectAllChange}
            handleRowCheckboxChange={handleRowCheckboxChange}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default memo(Posts);
