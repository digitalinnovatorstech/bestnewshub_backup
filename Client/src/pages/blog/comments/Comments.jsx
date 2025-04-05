import { memo, useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginatedTable from "../../../components/table/PaginatedTable";
import CommentColumns from "./CommentTableColumn";
import CloseIcon from "@mui/icons-material/Close";
import {
  BulkCommentApprove,
  BulkCommentDelete,
  BulkCommentFlagged,
  BulkCommentPending,
  BulkCommentReject,
  BulkCommentSpam,
  getCommentList,
} from "../../../services/slices/globalSlice";

const Comments = () => {
  const dispatch = useDispatch();
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
    },
  };
  // const commentLsit = useSelector((state) => state.global.commentLsit);
  const commentStore = useSelector((state) => state.global);
  const commentLsit = commentStore.commentLsit;
  const [filteredList, setFilteredList] = useState(commentLsit || []);
  useEffect(() => {
    setFilteredList(commentLsit);
  }, [commentLsit]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [loadingT, setLodingT] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [selectValue, setSelectValue] = useState("all");
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
      selectedValue === "Reject" ||
      selectedValue === "Pending" ||
      selectedValue === "Spam" ||
      selectedValue === "Flagged"
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
    status: "APPROVED",
  };
  const pendingPayload = {
    ids: selectedRows,
    status: "PENDING",
  };
  const spamPayload = {
    ids: selectedRows,
    status: "SPAM",
  };
  const flaggedPayload = {
    ids: selectedRows,
    status: "FLAGGED",
  };
  const rejectPayload = {
    ids: selectedRows,
    status: "REJECTED",
  };

  const handleBulkDelete = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkCommentDelete(deletePayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
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
      await dispatch(BulkCommentApprove(approvePayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkPendding = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkCommentPending(pendingPayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkSpam = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkCommentSpam(spamPayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
      setBulkOpertions("Bulk");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };
  const handleBulkFlagged = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkCommentFlagged(flaggedPayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
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
      await dispatch(BulkCommentReject(rejectPayload)).unwrap();
      await dispatch(getCommentList(payload)).unwrap();
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

  const fetchData = async (e) => {
    const { target } = e || {};
    const newStatus = target?.value ?? selectValue;
    const isSearch = target?.name === "search";

    if (isSearch) {
      setSearchValue(target.value);
      payload.params.searchQuery = target.value.trim();
    } else {
      setSelectValue(newStatus);
      payload.params.status = newStatus === "all" ? "" : newStatus;
    }

    setLodingT(true);
    try {
      await dispatch(getCommentList(payload));
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
    setTotalCount(commentStore?.paginationModel?.totalItems || 0);
  }, [commentStore.paginationModel]);

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
          marginTop: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ width: "45%", mr: 1 }}>
              <Select
                value={selectValue}
                onChange={fetchData}
                sx={{
                  height: "40px",
                  width: "100%",
                  color: "#895129",
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
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="SPAM">Spam</MenuItem>
                <MenuItem value="FLAGGED">Flagged</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                mr: 1,
                width: 230,
                background: "#fff",
                borderRadius: "10px",
              }}
            >
              <OutlinedInput
                type={"text"}
                placeholder="Enter Name"
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
          </Box>
          {selectedRows.length > 0 && (
            <FormControl
              sx={{
                width: "15%",
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
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Spam">Spam</MenuItem>
                <MenuItem value="Flagged">Flagged</MenuItem>
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
                : operationType === "Reject"
                ? "Confirm Rejection"
                : operationType === "Pending"
                ? "Mark as Pending"
                : operationType === "Spam"
                ? "Mark as Spam"
                : "Mark as Flagged"}
            </DialogTitle>
            <DialogContent>
              {operationType === "Delete"
                ? "Are you sure you want to delete the selected item(s)?"
                : operationType === "Approve"
                ? "Are you sure you want to approve the selected item(s)?"
                : operationType === "Reject"
                ? "Are you sure you want to reject the selected item(s)?"
                : operationType === "Pending"
                ? "Are you sure you want to mark the selected item(s) as pending?"
                : operationType === "Spam"
                ? "Are you sure you want to mark the selected item(s) as spam?"
                : "Are you sure you want to mark the selected item(s) as flagged?"}
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
                    : operationType === "Reject"
                    ? handleBulkReject
                    : operationType === "Pending"
                    ? handleBulkPendding
                    : operationType === "Spam"
                    ? handleBulkSpam
                    : handleBulkFlagged
                }
                disabled={BulkOpertionsLoading}
              >
                {BulkOpertionsLoading ? (
                  <CircularProgress size={24} sx={{ color: "#895129" }} />
                ) : operationType === "Delete" ? (
                  "Delete"
                ) : operationType === "Approve" ? (
                  "Approve"
                ) : operationType === "Reject" ? (
                  "Reject"
                ) : operationType === "Pending" ? (
                  "Pending"
                ) : operationType === "Spam" ? (
                  "Spam"
                ) : (
                  "Flagged"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box sx={{ padding: "0px 20px" }}>
          <PaginatedTable
            height={600}
            columns={CommentColumns()}
            rows={filteredList || []}
            loading={loadingT}
            setLoading={setLodingT}
            totalPages={Math.ceil(totalCount / paginationModel.pageSize)}
            page={paginationModel.page}
            totalData={commentStore?.paginationModel?.totalItems}
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

export default memo(Comments);
