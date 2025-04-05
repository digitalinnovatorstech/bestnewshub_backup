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
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginatedTable from "../../../components/table/PaginatedTable";
import UserColumns from "./UserTableColumn";
import SearchIcon from "@mui/icons-material/Search";
import {
  BulkUserAction,
  getUserList,
} from "../../../services/slices/userSlice";

const AllUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingT, setLodingT] = useState(false);
  const [selectValue, setSelectValue] = useState("all");
  const [selectType, setSelectType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const userStore = useSelector((state) => state.users);
  const usersList = userStore.usersList;
  const [filteredList, setFilteredList] = useState(usersList || []);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const payload = {
    params: {
      currentPage: paginationModel.page,
      perPage: paginationModel.pageSize,
      status: "",
      userType: "",
      searchQuery: "",
    },
  };

  useEffect(() => {
    setFilteredList(usersList);
  }, [usersList]);
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
      selectedValue === "Active" ||
      selectedValue === "Inactive"
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
    action: "DELETE",
  };

  const activePayload = {
    ids: selectedRows,
    status: "ACTIVE",
    action: "STATUSCHANGE",
  };
  const inactivePayload = {
    ids: selectedRows,
    status: "INACTIVE",
    action: "STATUSCHANGE",
  };

  const handleBulkDelete = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkUserAction(deletePayload)).unwrap();
      await dispatch(getUserList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkActive = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkUserAction(activePayload)).unwrap();
      await dispatch(getUserList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkInactive = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkUserAction(inactivePayload)).unwrap();
      await dispatch(getUserList(payload)).unwrap();
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
    if (!searchValue.trim()) return;
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

  // const fetchData = async (e) => {
  //   const { target } = e || {};
  //   const newStatus = target?.value ?? selectValue;
  //   const newType = target?.value ?? selectType;
  //   const isSearch = target?.name === "search";

  //   if (isSearch) {
  //     setSearchValue(target.value);
  //     payload.params.searchQuery = target.value.trim();
  //   } else if (target?.name === "status") {
  //     setSelectValue(newStatus);
  //     payload.params.status = newStatus === "all" ? "" : newStatus;
  //   } else if (target?.name === "userType") {
  //     setSelectType(newType);
  //     payload.params.userType = newType === "all" ? "" : newType;
  //   }

  //   setLodingT(true);
  //   try {
  //     await dispatch(getUserList(payload));
  //   } catch {
  //     toast.error("Error fetching data");
  //   } finally {
  //     setLodingT(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [paginationModel]);

  const fetchData = (e) => {
    const { target } = e || {};

    if (target?.name === "search") {
      setSearchValue(target.value.trim());
    } else if (target?.name === "status") {
      setSelectValue(target.value);
    } else if (target?.name === "userType") {
      setSelectType(target.value);
    }
  };

  useEffect(() => {
    const fetchUserList = async () => {
      setLodingT(true);
      try {
        const updatedPayload = {
          ...payload,
          params: {
            ...payload.params,
            status: selectValue === "all" ? "" : selectValue,
            userType: selectType === "all" ? "" : selectType,
            searchQuery: searchValue,
          },
        };

        await dispatch(getUserList(updatedPayload));
      } catch {
        toast.error("Error fetching data");
      } finally {
        setLodingT(false);
      }
    };

    fetchUserList();
  }, [selectValue, selectType, searchValue, dispatch]);

  useEffect(() => {
    setTotalCount(userStore?.paginationModel?.totalItems || 0);
  }, [userStore.paginationModel]);

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
          flex: 1,
          width: "98%",
          // maxHeight: "75%",
          overflow: "auto",
          marginTop: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            padding: { xs: "10px", sm: "10px 20px" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              width: "100%",
            }}
          >
            <FormControl
              sx={{
                width: { xs: "100%", sm: "15%" },
                mr: { xs: 0, sm: 1 },
                mb: { xs: 1, sm: 0 },
              }}
            >
              <Select
                name="status"
                value={selectValue}
                onChange={fetchData}
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
                <MenuItem value="all">Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: { xs: "100%", sm: "15%" },
                mr: { xs: 0, sm: 1 },
                mb: { xs: 1, sm: 0 },
              }}
            >
              <Select
                name="userType"
                value={selectType}
                onChange={fetchData}
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
                <MenuItem value="all">Role</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Guest Author">Guest Author</MenuItem>
                <MenuItem value="Freelance Writer">Freelance Writer</MenuItem>
                <MenuItem value="Subscriber">Subscriber</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              size="small"
              sx={{
                width: { xs: "100%", sm: 210 },
                background: "#fff",
                borderRadius: "10px",
              }}
            >
              <OutlinedInput
                type={"text"}
                placeholder="Enter Name"
                size="small"
                name="search"
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
                  mr: 1,
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
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Delete">Delete</MenuItem>
                </Select>
              </FormControl>
            )}
            <Dialog open={openDialog}>
              <DialogTitle>
                {operationType === "Delete"
                  ? "Confirm Delete"
                  : operationType === "Active"
                  ? "Confirm Active"
                  : "Confirm Inactive"}
              </DialogTitle>
              <DialogContent>
                {operationType === "Delete"
                  ? "Are you sure you want to delete the selected item(s)?"
                  : operationType === "Active"
                  ? "Are you sure you want to active the selected item(s)?"
                  : "Are you sure you want to inactive the selected item(s)?"}
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
                      : operationType === "Active"
                      ? handleBulkActive
                      : handleBulkInactive
                  }
                  disabled={BulkOpertionsLoading}
                >
                  {BulkOpertionsLoading ? (
                    <CircularProgress size={24} sx={{ color: "#895129" }} />
                  ) : operationType === "Delete" ? (
                    "Delete"
                  ) : operationType === "Active" ? (
                    "Active"
                  ) : (
                    "Inactive"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/admin/users/newUsers", {
                  state: { activeItem: "New User" },
                })
              }
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                alignSelf: { xs: "stretch", sm: "center" }, // Stretch button for mobile
                "&:hover": {
                  backgroundColor: "#895129",
                },
              }}
            >
              Create
            </Button>
          </Box>
        </Box>

        <Box sx={{ padding: "0px 20px" }}>
          <PaginatedTable
            height={500}
            columns={UserColumns()}
            rows={filteredList || []}
            loading={loadingT}
            setLoading={setLodingT}
            totalPages={Math.ceil(totalCount / paginationModel.pageSize)}
            page={paginationModel.page}
            totalData={userStore?.paginationModel?.totalItems}
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

export default memo(AllUsers);
