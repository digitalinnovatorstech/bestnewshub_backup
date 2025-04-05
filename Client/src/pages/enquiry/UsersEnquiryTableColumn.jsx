import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, formatStatus } from "../../utility/helpers/globalHelpers";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getContactEnquiryList,
  updateEnquiryStatus,
} from "../../services/slices/enquirySlice";

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
});

const UserTableColumn = () => {
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const [openToggle, setOpenToggle] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const payload = {
    params: {
      currentPage: 1,
      perPage: 10,
      status: "",
      userType: "",
      searchQuery: "",
    },
  };
  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpenToggle(true);
  };

  const UserDetailsDialog = ({ open, onClose, user }) => {
    return (
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
        open={open}
        onClose={onClose}
      >
        <DialogContent
          sx={{
            padding: "20px",
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
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              User Details
            </Typography>
            {user && (
              <Box sx={{ marginTop: 2 }}>
                <Typography>
                  <strong>Name:</strong> {user.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography>
                  <strong>Status:</strong>
                </Typography>
                <Select
                  value={user.status}
                  onChange={async (e) => {
                    try {
                      const newValue = e.target.value;
                      const response = await dispatch(
                        updateEnquiryStatus({
                          id: user.id,
                          data: {
                            status: newValue,
                          },
                        })
                      ).unwrap();
                      if (response?.success === true) {
                        toast.success(response?.message);
                        setOpenToggle(false);
                        setSelectedUser(null);
                        await dispatch(getContactEnquiryList(payload));
                      } else {
                        toast.error(response?.message);
                      }
                    } catch (error) {
                      toast.error(error?.message);
                    }
                  }}
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
                  <MenuItem value="NEW">New</MenuItem>
                  <MenuItem value="CONTACTED">Contacted</MenuItem>
                </Select>
                <Typography sx={{ marginTop: 1 }}>
                  <strong>Message:</strong> {user.message}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  const UsersEnquiryTableColumn = [
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
        <>
          <Box
            sx={{
              cursor: "pointer",
              color: "#895129",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => handleOpen(params.row)}
          >
            {params?.row?.name}
          </Box>
          <UserDetailsDialog
            open={openToggle}
            onClose={() => setOpenToggle(false)}
            user={selectedUser}
          />
        </>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      renderHeader: () => <StyledHeader>Email</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.email,
    },
    {
      field: "message",
      headerName: "Message",
      renderHeader: () => <StyledHeader>Message</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        const message = params?.row?.message || "";
        const truncatedMessage =
          message.split(" ").slice(0, 3).join(" ") +
          (message.split(" ").length > 3 ? "..." : "");

        return <div>{truncatedMessage}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      date: true,
      renderHeader: () => <StyledHeader>Date</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => formatDate(params?.row?.createdAt),
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
        const enqueryStatus = params?.row?.status;

        const getStatusColor = (status) => {
          switch (status) {
            case "NEW":
              return "#FFC700";
            case "CONTACTED":
              return "#00D408";
            default:
              return "#6c757d";
          }
        };
        return (
          <div
            style={{
              color: "#fff",
              // fontSize: "0.85rem",
              fontSize: isTabMode ? "0.55rem" : "0.85rem",
              textAlign: "center",
              minWidth: "80px",
            }}
          >
            <span
              style={{
                background: getStatusColor(enqueryStatus),
                padding: "4px 8px",
                borderRadius: "40px",
                display: "inline-block",
                width: "75%",
                boxSizing: "border-box",
              }}
            >
              {formatStatus(enqueryStatus)}
            </span>
          </div>
        );
      },
    },
  ];
  return UsersEnquiryTableColumn;
};

export default UserTableColumn;
