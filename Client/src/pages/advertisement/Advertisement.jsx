import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  BulkAdvertisementDelete,
  getadvisementList,
} from "../../services/slices/advisementSlice";
import PaginatedTable from "../../components/table/PaginatedTable";
import AdvertisementColumn from "./AdvertisementTableColumn";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Advertisement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingT, setLodingT] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const payload = {
    params: {
      currentPage: paginationModel.page,
      perPage: paginationModel.pageSize,
    },
  };
  const advisementStore = useSelector((state) => state.ads);
  const advisementList = advisementStore.advisementList;
  const [filteredList, setFilteredList] = useState(advisementList || []);
  useEffect(() => {
    setFilteredList(advisementList);
  }, [advisementList]);
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
      await dispatch(BulkAdvertisementDelete(deletePayload)).unwrap();
      await dispatch(getadvisementList(payload)).unwrap();
      setOpenDialog(false);
      setSelectedRows([]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBulkOpertionsLoading(false);
    }
  };

  const fetchData = async () => {
    setLodingT(true);
    try {
      await dispatch(getadvisementList(payload));
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
    setTotalCount(advisementStore?.paginationModel?.totalItems || 0);
  }, [advisementStore.paginationModel]);

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
            alignContent: "center",
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
            <Typography
              variant="h5"
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#895129",
              }}
            >
              Advertisements
            </Typography>
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
                navigate("/admin/advertisement/addAdvertisement", {
                  state: { activeItem: "New Ads" },
                })
              }
              sx={{
                ml: 2,
                // padding: "8px 10px",
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
            columns={AdvertisementColumn()}
            rows={filteredList || []}
            loading={loadingT}
            setLoading={setLodingT}
            totalPages={Math.ceil(totalCount / paginationModel.pageSize)}
            page={paginationModel.page}
            totalData={advisementStore?.paginationModel?.totalItems}
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

export default memo(Advertisement);
