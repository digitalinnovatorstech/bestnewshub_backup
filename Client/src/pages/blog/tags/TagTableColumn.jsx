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
import {
  capitalizeFirstLetter,
  formatDate,
  formatStatus,
  truncateName,
} from "../../../utility/helpers/globalHelpers";
import { deleteTag, getTagList } from "../../../services/slices/tagSlice";
import { toast } from "react-toastify";

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
});

const TagTableColumn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const payload = {
    params: {
      currentPage: 1,
      perPage: 10,
      searchQuery: "",
    },
  };
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await dispatch(deleteTag({ tagId: selectedId })).unwrap();
      await dispatch(getTagList(payload)).unwrap();
      setSelectedId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const TagColumns = [
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
      renderCell: (params) => <>{truncateName(params?.row?.name)}</>,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      date: true,
      renderHeader: () => <StyledHeader>Created At</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => formatDate(params?.row?.createdAt),
    },
    {
      field: "Posts",
      headerName: "Posts",
      date: true,
      renderHeader: () => <StyledHeader>Posts</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => params?.row?.Posts?.length || 0,
    },
    {
      field: "status",
      headerName: "Status",
      renderHeader: () => <StyledHeader>Status</StyledHeader>,
      sortable: true,
      flex: 1,
      disableColumnMenu: true,
      disableColumnFilter: true,
      valueGetter: (_, row) => capitalizeFirstLetter(row?.status),
      renderCell: (params) => {
        const leadStatus = params?.row?.status;

        const getStatusColor = (status) => {
          switch (status) {
            case "PROCESSING":
              return "#007AFF";
            case "DRAFT":
              return "#FFC700";
            case "PUBLISHED":
              return "#00D408";
            case "CANCELLED":
              return "#FF0000";
            default:
              return "#6c757d";
          }
        };
        return (
          <div
            style={{
              color: "#fff",
              fontSize: "0.85rem",
              textAlign: "center",
              minWidth: "80px",
            }}
          >
            <span
              style={{
                background: getStatusColor(leadStatus),
                padding: "4px 8px",
                borderRadius: "40px",
                display: "inline-block",
                width: "60%",
                boxSizing: "border-box",
              }}
            >
              {formatStatus(leadStatus) || "N/A"}
            </span>
          </div>
        );
      },
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
              localStorage.setItem("tagId", params?.row?.id);
              navigate(`/admin/tags/EditTags?id=${params?.row?.id}`);
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
  return TagColumns;
};

export default TagTableColumn;
