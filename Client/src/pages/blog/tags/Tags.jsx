import { memo, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Container,
  Stack,
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
import { BulkTagDelete, getTagList } from "../../../services/slices/tagSlice";
import PaginatedTable from "../../../components/table/PaginatedTable";
import TagColumns from "./TagTableColumn";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingT, setLodingT] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const payload = {
    params: {
      currentPage: paginationModel.page,
      perPage: paginationModel.pageSize,
      searchQuery: "",
    },
  };
  // const tagList = useSelector((state) => state.tag.tagList);
  const tagStore = useSelector((state) => state.tag);
  const tagList = tagStore.tagList;
  const [filteredList, setFilteredList] = useState(tagList || []);
  useEffect(() => {
    setFilteredList(tagList);
  }, [tagList]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [BulkOpertionsLoading, setBulkOpertionsLoading] = useState(false);

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

  const handleBulkDelete = async (event) => {
    event.preventDefault();
    try {
      setBulkOpertionsLoading(true);
      await dispatch(BulkTagDelete(deletePayload)).unwrap();
      await dispatch(getTagList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
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
    const isSearch = target?.name === "search";

    if (isSearch) {
      setSearchValue(target.value);
      payload.params.searchQuery = target.value.trim();
    }

    setLodingT(true);
    try {
      await dispatch(getTagList(payload));
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
    setTotalCount(tagStore?.paginationModel?.totalItems || 0);
  }, [tagStore.paginationModel]);

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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {selectedRows.length > 0 && (
              <Button
                variant="contained"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  ml: 2,
                  bgcolor: "#FF0000",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#FF0000",
                  },
                }}
              >
                Bulk Delete
              </Button>
            )}
            <Dialog open={openDialog}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                Are you sure you want to delete the selected item(s)?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    setSelectedRows([]);
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
                  onClick={handleBulkDelete}
                  disabled={BulkOpertionsLoading}
                >
                  {BulkOpertionsLoading ? (
                    <CircularProgress size={24} sx={{ color: "#895129" }} />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/admin/tags/addTags", {
                  state: { activeItem: "New Tag" },
                })
              }
              sx={{
                ml: 2,
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

        <Box sx={{ padding: "0px 20px" }}>
          <PaginatedTable
            height={600}
            columns={TagColumns()}
            rows={filteredList || []}
            loading={loadingT}
            setLoading={setLodingT}
            totalPages={Math.ceil(totalCount / paginationModel.pageSize)}
            page={paginationModel.page}
            totalData={tagStore?.paginationModel?.totalItems}
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
