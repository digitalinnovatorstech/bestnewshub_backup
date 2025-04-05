import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import {
  capitalizeFirstLetter,
  formatDate,
  formatStatus,
  truncateDescription,
  truncateName,
} from "../../../utility/helpers/globalHelpers";

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
});

const CommentTableColumn = () => {
  const CommentColumns = [
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
      field: "postName",
      headerName: "Post Name",
      renderHeader: () => <StyledHeader>Post Name</StyledHeader>,
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
            localStorage.setItem("postId", params?.row?.id);
            // window.open(
            //   `/News/${params?.row?.post?.permalink?.toLowerCase()}`,
            //   "_blank"
            // );
            const permalink = params?.row?.post?.permalink?.toLowerCase();
            const url = `${
              import.meta.env.VITE_API_LANDING_URL
            }/news/${permalink}`;
            window.open(url, "_blank");
          }}
        >
          {truncateName(params?.row?.post?.metaTitle)}
        </Box>
      ),
    },
    {
      field: "comment",
      headerName: "Comment",
      renderHeader: () => <StyledHeader>Comment</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      renderCell: (params) => truncateDescription(params?.row?.description),
    },
    {
      field: "username",
      headerName: "User",
      renderHeader: () => <StyledHeader>User</StyledHeader>,
      flex: 1.3,
      sortable: true,
      disableColumnFilter: true,
      disableColumnMenu: true,
      // renderCell: (params) => params?.row?.username,
      renderCell: (params) => {
        const firstName = params?.row?.creator?.firstName || "N/A";
        const lastName = params?.row?.creator?.lastName || "";
        return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
          lastName
        )}`.trim();
      },
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      date: true,
      renderHeader: () => <StyledHeader>Created Date</StyledHeader>,
      sortable: true,
      flex: 1.2,
      disableColumnMenu: true,
      disableColumnFilter: true,
      renderCell: (params) => formatDate(params?.row?.createdDate),
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
            case "PENDING":
              return "#007AFF";
            case "SPAM":
              return "#FFC700";
            case "APPROVED":
              return "#00D408";
            case "REJECTED":
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
            {params?.row?.status && (
              <span
                style={{
                  background: getStatusColor(leadStatus),
                  padding: "4px 8px",
                  borderRadius: "40px",
                  display: "inline-block",
                  width: "70%",
                  boxSizing: "border-box",
                }}
              >
                {formatStatus(leadStatus)}
              </span>
            )}
          </div>
        );
      },
    },
  ];
  return CommentColumns;
};

export default CommentTableColumn;
