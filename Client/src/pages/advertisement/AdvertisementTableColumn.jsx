import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, truncateName } from "../../utility/helpers/globalHelpers";
import {
  deleteAdvertisement,
  getadvisementList,
} from "../../services/slices/advisementSlice";
import { toast } from "react-toastify";

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
});

const AdvertisementTableColumn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const payload = {
    params: {
      currentPage: 1,
      perPage: 10,
    },
  };
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await dispatch(
        deleteAdvertisement({ advisementId: selectedId })
      ).unwrap();
      await dispatch(getadvisementList(payload)).unwrap();
      setSelectedId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const AdvertisementColumn = [
    {
      field: "sNo",
      headerName: "S.No",
      renderHeader: () => <StyledHeader>S. No</StyledHeader>,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      disableColumnFilter: true,
    },
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => <StyledHeader>Name</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#895129",
            fontWeight: "bold",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => {
            window.open(`${params?.row?.advertisementUrl}`, "_blank");
          }}
        >
          {truncateName(params?.row?.title)}
        </Box>
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      date: true,
      renderHeader: () => <StyledHeader>Start Date</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => formatDate(params?.row?.startDate),
    },
    {
      field: "EndDate",
      headerName: "End Date",
      date: true,
      renderHeader: () => <StyledHeader>End Date</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => formatDate(params?.row?.endDate),
    },
    {
      field: "action",
      headerName: "Action",
      renderHeader: () => <StyledHeader></StyledHeader>,
      sortable: false,
      flex: 1,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <EditNoteIcon
            sx={{ color: "green", cursor: "pointer" }}
            onClick={() => {
              localStorage.setItem("advisementId", params?.row?.id);
              navigate(
                `/admin/advertisement/editAdvertisement?id=${params?.row?.id}`
              );
            }}
          />
          <DeleteOutlineIcon
            sx={{ color: "#FF0000", cursor: "pointer" }}
            onClick={() => {
              setSelectedId(params?.row?.id);
              setIsDeleteDialogOpen(true);
            }}
          />
          <Dialog
            BackdropProps={{
              style: {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
            PaperProps={{
              style: {
                boxShadow: "none",
              },
            }}
            open={isDeleteDialogOpen}
          >
            <DialogContent
              sx={{
                padding: "30px",
                position: "relative",
                textAlign: "center",
                width: "400px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <DialogContentText
                sx={{
                  fontSize: "18px",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <DeleteOutlineIcon
                  sx={{ fontSize: "30px", color: "#FF3B30" }}
                />
                Are you sure you want to delete the selected record?
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                gap: "10px",
                paddingBottom: "20px",
              }}
            >
              <Button
                sx={{
                  background: "#808080",
                  color: "white",
                  padding: "8px 20px",
                  "&:hover": {
                    background: "#696969",
                  },
                  borderRadius: "4px",
                }}
                startIcon={<CloseIcon />}
                onClick={() => {
                  setSelectedId(null);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  background: "#FF3B30",
                  color: "white",
                  padding: "8px 20px",
                  "&:hover": {
                    background: "#D32F2F",
                  },
                  borderRadius: "4px",
                }}
                startIcon={<DeleteOutlineIcon />}
                onClick={handleConfirmDelete}
                autoFocus
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#895129" }} />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ),
    },
  ];
  return AdvertisementColumn;
};

export default AdvertisementTableColumn;
