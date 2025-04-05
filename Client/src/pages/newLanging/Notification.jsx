import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Backdrop,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SortIcon from "@mui/icons-material/Sort";
import { memo, useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingNotificationAll,
  landingNotificationRead,
} from "../../services/slices/landingSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [showRead, setShowRead] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxVisibility, setCheckboxVisibility] = useState({});
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const LandingNotificationListAll = useSelector(
    (state) => state.landing.LandingNotificationListAll
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getLandingNotificationAll()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelection = (option) => {
    if (option === "All") {
      setShowRead(null);
    } else {
      setShowRead(option === "Read");
    }
    setSortAnchorEl(null);
  };

  const filteredNotifications =
    showRead !== null
      ? LandingNotificationListAll?.filter(
          (notification) => notification.isRead === showRead
        )
      : LandingNotificationListAll?.map((notification) => ({
          ...notification,
          isRead: notification.isRead ?? false,
        }));
  const handleMessageClick = (notificationId) => {
    setCheckboxVisibility((prev) => ({
      ...prev,
      [notificationId]: !prev[notificationId],
    }));

    if (checkboxVisibility[notificationId]) {
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );
    } else {
      setSelectedNotifications((prev) => [...prev, notificationId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications?.map((n) => n.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (event, notificationId) => {
    if (event.target.checked) {
      setSelectedNotifications((prev) => [...prev, notificationId]);
    } else {
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );
    }
  };
  useEffect(() => {
    setShowDeleteIcon(selectedNotifications.length > 0);
  }, [selectedNotifications]);

  // delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleConfirmDelete = () => {
    setLoadingDelete(true);
    setIsDeleteDialogOpen(false);
  };

  // read
  const handleConfirmRead = async (id) => {
    try {
      const response = await dispatch(landingNotificationRead(id)).unwrap();
      if (response?.success === true) {
        toast.success(response?.message);
        setSelectedNotifications([]);
        setCheckboxVisibility({});
        await dispatch(getLandingNotificationAll()).unwrap();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Box sx={{ my: 4, maxWidth: "90%", margin: "auto" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, sm: 4 },
            borderBottom: "1px solid #895129",
            color: "#895129",
            mt: "1em",
          }}
        >
          Notifications
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 2,
            mb: { xs: 2, sm: 0 },
          }}
        >
          {showDeleteIcon && (
            <IconButton
              sx={{
                backgroundColor: "#804000",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "#7B3300",
                  borderColor: "#804000",
                },
              }}
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          )}

          <IconButton
            onClick={handleSelectAll}
            color="#7B3300"
            style={{
              border: "2px solid #895129",
              borderRadius: "0",
              fontSize: "16px",
            }}
          >
            <Typography
              variant="button"
              sx={{ fontWeight: "bold", color: "#895129" }}
            >
              {selectAll ? "Unselect All" : "Select All"}
            </Typography>
          </IconButton>

          <IconButton
            onClick={handleSortClick}
            color="#7B3300"
            style={{
              border: "2px solid #895129",
              borderRadius: "0",
              fontSize: "16px",
            }}
          >
            <SortIcon sx={{ color: "#895129" }} />
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#895129",
              }}
            >
              Sort
            </Typography>
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSortSelection("All")}>All</MenuItem>
            <MenuItem onClick={() => handleSortSelection("Read")}>
              Read
            </MenuItem>
            <MenuItem onClick={() => handleSortSelection("Unread")}>
              Unread
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {filteredNotifications?.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#7B3300",
            mt: 2,
          }}
        >
          {showRead === null
            ? "No Notifications Available"
            : showRead
            ? "No Read Notifications Available"
            : "No Unread Notifications Available"}
        </Typography>
      ) : (
        filteredNotifications?.map((notification, index) => (
          <Paper
            key={notification.id || index}
            sx={{
              p: 1,
              mb: 0,
              backgroundColor: notification.isRead ? "#ffffff" : "#F2EBE6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
              borderBottom: "2px solid #ccc",
              "&:hover": {
                backgroundColor: "#F2EBE6",
              },
            }}
            onClick={() => handleMessageClick(notification.id)}
          >
            <Checkbox
              sx={{
                color: selectAll ? "#895129" : "#895129",
                visibility:
                  selectAll || checkboxVisibility[notification.id]
                    ? "visible"
                    : "hidden",
                "&.Mui-checked": {
                  color: "#895129",
                },
              }}
              checked={selectedNotifications.includes(notification.id)}
              onChange={(e) => handleCheckboxChange(e, notification.id)}
            />

            <Box sx={{ flexGrow: 1, position: "relative" }}>
              <Box
                sx={{
                  // position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {new Date(notification.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {notification.isRead === false && (
                    <Typography
                      variant="body2"
                      onClick={() => handleConfirmRead(notification.id)}
                      sx={{
                        color: "#804000",
                        mr: 1,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Mark as Read
                    </Typography>
                  )}
                  <IconButton
                    onClick={() => {
                      localStorage.setItem("postId", notification?.id);
                      navigate(`/news/${notification?.permalink}`, {
                        state: {
                          selectedCategory: notification?.Categories?.[0]?.id,
                          scrollToPost: true,
                        },
                      });
                    }}
                    sx={{
                      // position: "absolute",
                      // right: 10,
                      // mt: 2,
                      // zIndex: 2,
                      backgroundColor: "#804000",
                      color: "white",
                      padding: "8px",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "#804000",
                      },
                      "&:hover svg": {
                        transform: "rotate(-90deg)",
                        transition: "transform 0.3s ease",
                        color: "#804000",
                      },
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mt: 0, color: "#7B3300" }}
              >
                {notification.notificationsTitle}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0 }}>
                {notification.notificationContent}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
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
      >
        <DialogContent
          sx={{
            padding: "30px",
            position: "relative",
            textAlign: "center",
            width: { xs: "100%", sm: "400px" },
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
            <DeleteOutlineIcon sx={{ fontSize: "30px", color: "#FF3B30" }} />
            Are you sure you want to delete the selected notification?
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
            onClick={() => {
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
            onClick={handleConfirmDelete}
            autoFocus
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <CircularProgress size={24} sx={{ color: "#895129" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default memo(Notification);
