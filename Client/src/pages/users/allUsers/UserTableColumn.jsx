import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  capitalizeFirstLetter,
  formatDate,
} from "../../../utility/helpers/globalHelpers";

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
});

const UserTableColumn = () => {
  const navigate = useNavigate();

  const UserColumns = [
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
      field: "username",
      headerName: "UserID",
      renderHeader: () => <StyledHeader>UserID</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.userName,
    },
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => <StyledHeader>User Name</StyledHeader>,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      disableColumnFilter: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#895129",
            fontWeight: "bold",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => {
            localStorage.setItem("userIdv", params?.row?.id);
            const id = params?.row?.id;
            navigate(`/admin/users/view?id=${id}`);
          }}
        >
          {capitalizeFirstLetter(params?.row?.firstName)}{" "}
          {capitalizeFirstLetter(params?.row?.lastName)}
        </Box>
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
      field: "phoneNo",
      headerName: "Phone Number",
      renderHeader: () => <StyledHeader>Phone Number</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.phoneNumber,
    },
    {
      field: "role",
      headerName: "Role",
      renderHeader: () => <StyledHeader>Role</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {capitalizeFirstLetter(params?.row?.userType?.toLowerCase() || "")}
          </>
        );
      },
    },
    {
      field: "posts",
      headerName: "Posts",
      renderHeader: () => <StyledHeader>Posts</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.blogPostCount,
    },
    {
      field: "createdAt",
      headerName: "Created",
      date: true,
      renderHeader: () => <StyledHeader>Created</StyledHeader>,
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
      flex: 0.8,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => {
        const leadStatus = params.row?.status?.toUpperCase() || "INACTIVE";

        const getStatusColor = (status) => {
          switch (status) {
            case "ACTIVE":
              return "#00D408";
            case "INACTIVE":
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
                width: "100%",
              }}
            >
              {capitalizeFirstLetter(leadStatus.toLowerCase())}
            </span>
          </div>
        );
      },
    },
  ];
  return UserColumns;
};

export default UserTableColumn;
