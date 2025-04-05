import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserDetails,
  updateUserStatus,
} from "../../../services/slices/userSlice";
import { capitalizeFirstLetter } from "../../../utility/helpers/globalHelpers";
import PostColumns from "../../blog/posts/PostTableColumn";
import UserPostTable from "./UserPostTable";

const UserView = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const id = localStorage.getItem("userIdv");
  const userDetails = useSelector((state) => state.users.userDetails);
  const [loadingT, setLodingT] = useState(false);
  let userpostList = useSelector((state) => state.users.userpostList);
  useEffect(() => {
    setLoading(true);
    dispatch(getUserDetails(id)).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);
  const [openCloser, setOpenCloser] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    status: userDetails?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  });

  const handleStatusChange = async () => {
    try {
      setButtonLoading(true);
      const updatedStatus =
        formValues.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      setFormValues({ status: updatedStatus });
      await dispatch(
        updateUserStatus({ id, formValues: { status: updatedStatus } })
      ).unwrap();
      await dispatch(getUserDetails(id)).unwrap();
      setTimeout(() => {
        setOpenCloser(false);
      }, 1000);
    } catch (error) {
      setButtonLoading(false);
      toast.error(error.message);
    } finally {
      setButtonLoading(false);
    }
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Stack
        sx={{
          width: "98%",
          flex: 1,
          overflow: "auto",
          marginTop: "15px",
        }}
      >
        <Stack
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9F9F9",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography
              variant="h5"
              sx={{ cursor: "pointer", color: "#895129" }}
              onClick={() => navigate("/admin/users/allUsers")}
            >
              Users
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">{userDetails?.firstName || ""}</Typography>
          </Box>
          <Box sx={{}}>
            <Button
              variant="contained"
              onClick={() => navigate(`/admin/users/edit?id=${id}`)}
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#895129",
                },
              }}
            >
              Edit
            </Button>
          </Box>
        </Stack>
        <Stack
          sx={{
            background: "#fff",
            flex: 1,
            // overflow: "auto",
            padding: "20px",
          }}
        >
          <Card variant="outlined" sx={{ padding: 1 }}>
            <CardContent>
              <Grid container spacing={2} sx={{}}>
                <Grid item xs={8} sx={{ display: "flex" }}>
                  <Avatar
                    alt={userDetails?.firstName || ""}
                    src={userDetails?.profilePhoto}
                    sx={{ width: 120, height: 120 }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Username: {userDetails?.userName || ""}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#895129",
                        marginBottom: 1,
                      }}
                    >
                      {capitalizeFirstLetter(userDetails?.firstName) || ""}{" "}
                      {userDetails?.lastName || ""}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ marginTop: 1 }}
                    >
                      {userDetails?.status === "ACTIVE" && (
                        <Chip
                          label="Active"
                          sx={{ background: "#4BC858", color: "#FFF" }}
                        />
                      )}
                      {userDetails?.status === "INACTIVE" && (
                        <Chip
                          label="Inactive"
                          sx={{ background: "#FF7276", color: "#FFF" }}
                        />
                      )}
                      <Switch
                        checked={userDetails?.status === "ACTIVE"}
                        onChange={() => setOpenCloser(true)}
                      />
                      <Dialog open={openCloser}>
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
                              color: "#333",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                              Confirm Status Change
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: "14px",
                                marginTop: "10px",
                                color: "#b0b0b0",
                              }}
                            >
                              Are you sure you want to set the user as{" "}
                              {userDetails?.status === "ACTIVE"
                                ? "Inactive"
                                : "Active"}
                              ?
                            </Typography>
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
                            onClick={() => setOpenCloser(false)}
                          >
                            Discard
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
                            onClick={handleStatusChange}
                            disabled={buttonLoading}
                          >
                            {buttonLoading ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "#895129" }}
                              />
                            ) : userDetails?.status === "ACTIVE" ? (
                              "Inactive"
                            ) : (
                              "Active"
                            )}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Stack>
                    <Grid
                      container
                      spacing={3}
                      sx={{
                        flexWrap: "nowrap",
                        dispay: "flex",
                        flexDirection: isTabMode ? "column" : "row",
                        overflow: "auto",
                        marginTop: "1px",
                      }}
                    >
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Joining Date
                        </Typography>
                        <Typography>
                          {userDetails?.joiningDate
                            ? new Date(
                                userDetails?.joiningDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Email
                        </Typography>
                        <Typography>{userDetails?.email || ""}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Phone Number
                        </Typography>
                        <Typography>
                          {userDetails?.phoneNumber || ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box sx={{ mt: 2 }}>
            <UserPostTable
              columns={PostColumns()}
              rows={userpostList || []}
              loading={loadingT}
              setLoading={setLodingT}
            />
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(UserView);
