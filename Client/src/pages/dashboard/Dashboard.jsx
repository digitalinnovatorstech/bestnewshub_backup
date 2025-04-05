import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
// import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
// import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
// import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashbaordBarchart,
  getDashbaordCommentList,
  getDashbaordComments,
  getDashbaordOverview,
} from "../../services/slices/dashboardSlice";
import { getPostList } from "../../services/slices/postSlice";
import {
  formatNameLowerUpper,
  truncateName,
} from "../../utility/helpers/globalHelpers";

import { useNavigate } from "react-router-dom";

const payload = {
  params: {
    currentPage: 1,
    perPage: 5,
    searchQuery: "",
    startDate: "",
    endDate: "",
    status: "",
  },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [view, setView] = useState("WEEKLY");
  const [loading, setLoading] = useState(false);
  const [loadingV, setLoadingV] = useState(false);
  const dashbaordoverviewList = useSelector(
    (state) => state.dashboard.dashbaordoverviewList
  );
  // const dashbaordcommentsList = useSelector(
  //   (state) => state.dashboard.dashbaordcommentsList
  // );
  const dashbaordBarchart = useSelector(
    (state) => state.dashboard.dashbaordBarchart
  );
  const postStore = useSelector((state) => state.post);
  const postList = postStore.postList;
  // const dashbaordCommentList = useSelector(
  //   (state) => state.dashboard.dashbaordCommentList
  // );

  useEffect(() => {
    setLoadingV(true);
    dispatch(getDashbaordOverview()).finally(() => {
      setLoadingV(false);
    });
    dispatch(getDashbaordComments());
    dispatch(getDashbaordBarchart(view)).finally(() => {
      setLoadingV(false);
    });
    dispatch(getPostList(payload));
    dispatch(getDashbaordCommentList());
  }, [dispatch]);

  const handleViewChange = (view) => {
    setView(view);
    setLoading(true);
    dispatch(getDashbaordBarchart(view)).finally(() => {
      setLoading(false);
    });
  };
  const formattedData =
    view === "WEEKLY"
      ? dashbaordBarchart?.map((item) => ({
          name: `${item.period?.split("-")[2]?.split("T")[0]}`,
          Post: item.totalRecords,
        }))
      : dashbaordBarchart?.map((item) => ({
          name: item.period,
          Post: item.totalRecords,
        }));

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "92vh",
        display: "flex",
        overflow: "hidden",
        padding: { xs: "5px", sm: "15px" },
      }}
    >
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingV}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Stack
        sx={{
          width: "98%",
          // maxHeight: "85%",
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          sx={{ position: "sticky" }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#895129", fontSize: { xs: "14px", sm: "16px" } }}
          >
            DASHBOARD
          </Typography>
        </Stack>
        <Stack
          sx={{
            marginTop: { xs: "2px", sm: "5px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* <Grid container spacing={2} sx={{ padding: "10px" }}>
            <Grid item xs={3}>
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <RemoveRedEyeOutlinedIcon sx={{ color: "#489019" }} />
                <Typography
                  sx={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  2,223,214
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#949494",
                    }}
                  >
                    Total Visitor
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "lightgreen",
                      marginLeft: "10px",
                    }}
                  >
                    <TrendingUpIcon
                      sx={{ fontSize: "12px", color: "#489019" }}
                    />
                    <Typography
                      sx={{
                        marginLeft: "5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "#489019",
                      }}
                    >
                      +22
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ChatOutlinedIcon sx={{ color: "#489019" }} />
                <Typography
                  sx={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  234,032
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#949494",
                    }}
                  >
                    Total Comments
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "lightgreen",
                      marginLeft: "10px",
                    }}
                  >
                    <TrendingUpIcon
                      sx={{ fontSize: "12px", color: "#489019" }}
                    />
                    <Typography
                      sx={{
                        marginLeft: "5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "#489019",
                      }}
                    >
                      +4
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FileDownloadOutlinedIcon sx={{ color: "#489019" }} />
                <Typography
                  sx={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  114,032
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#949494",
                    }}
                  >
                    Author Articles
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "lightgreen",
                      marginLeft: "10px",
                    }}
                  >
                    <TrendingUpIcon
                      sx={{ fontSize: "12px", color: "#489019" }}
                    />
                    <Typography
                      sx={{
                        marginLeft: "5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "#489019",
                      }}
                    >
                      +11
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <LocalLibraryOutlinedIcon sx={{ color: "#E42121" }} />
                <Typography
                  sx={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  1,959,453
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#949494",
                    }}
                  >
                    Total Impression
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "#FFB199",
                      marginLeft: "10px",
                    }}
                  >
                    <TrendingDownIcon
                      sx={{ fontSize: "12px", color: "#E42121" }}
                    />
                    <Typography
                      sx={{
                        marginLeft: "5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "#E42121",
                      }}
                    >
                      -9
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid> */}
          <Grid
            container
            spacing={2}
            sx={{
              padding: { xs: "0px 5px", sm: "0px 10px", md: "0px 10px" },
              marginTop: { xs: "2px", sm: "5px", md: "5px" },
            }}
          >
            <Grid item xs={12} sm={9} md={9}>
              <Card
                sx={{
                  marginBottom: { xs: "5px", sm: "20px" },
                  padding: { xs: "5px", sm: "15px", md: "20px" },
                  position: "relative",
                  boxShadow: "none",
                }}
              >
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: 1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    padding: "0 15px",
                    marginBottom: "10px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "16px", sm: "18px" },
                        fontWeight: "bold",
                      }}
                      variant="h6"
                    >
                      Post Growth
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "10px", sm: "12px" },
                        color: "#949494",
                      }}
                    >
                      Overall Information
                    </Typography>
                  </Box>
                  <Box sx={{ marginTop: { xs: "10px", sm: "0px" } }}>
                    <Button
                      variant={view === "WEEKLY" ? "contained" : "outlined"}
                      onClick={() => handleViewChange("WEEKLY")}
                      sx={{
                        borderRadius: "50px",
                        padding: { xs: "5px 15px", sm: "5px 20px" },
                        textTransform: "none",
                        backgroundColor:
                          view === "WEEKLY" ? "#895129" : "transparent",
                        borderColor: "#895129",
                        color: view === "WEEKLY" ? "#fff" : "#895129",
                        "&:hover": {
                          backgroundColor:
                            view === "WEEKLY"
                              ? "#895129"
                              : "rgba(255, 106, 100, 0.1)",
                          borderColor: "#895129",
                        },
                      }}
                    >
                      Weekly
                    </Button>
                    <Button
                      variant={view === "MONTHLY" ? "contained" : "outlined"}
                      onClick={() => handleViewChange("MONTHLY")}
                      sx={{
                        borderRadius: "50px",
                        padding: { xs: "5px 15px", sm: "5px 20px" },
                        textTransform: "none",
                        marginLeft: { xs: "5px", sm: "10px" },
                        backgroundColor:
                          view === "MONTHLY" ? "#895129" : "transparent",
                        borderColor: "#895129",
                        color: view === "MONTHLY" ? "#fff" : "#895129",
                        "&:hover": {
                          backgroundColor:
                            view === "MONTHLY"
                              ? "#895129"
                              : "rgba(255, 106, 100, 0.1)",
                          borderColor: "#895129",
                        },
                      }}
                    >
                      Monthly
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ padding: { xs: "0px 5px", sm: "0px 15px" } }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={formattedData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Post" fill="#895129" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Card
                sx={{
                  marginBottom: { xs: "5px", sm: "10px" },
                  padding: { xs: "5px", sm: "15px", md: "10px" },
                  boxShadow: "none",
                }}
              >
                {[
                  {
                    label: "Total Posts",
                    value: dashbaordoverviewList?.totalPostCount || 0,
                    icon: ArticleIcon,
                  },
                  {
                    label: "Total Users",
                    value: dashbaordoverviewList?.totalAuthors || 0,
                    icon: GroupOutlinedIcon,
                  },
                  {
                    label: "Total Subscriber",
                    value: dashbaordoverviewList?.totalSubscriber || 0,
                    icon: SubscriptionsIcon,
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      marginTop: "15px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: { xs: "8px", sm: "10px" },
                      background: "#FFF7F1",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "12px" }}>
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", sm: "18px" },
                          fontWeight: "bold",
                        }}
                        variant="h6"
                      >
                        {item.value}
                      </Typography>
                    </Box>
                    <item.icon
                      sx={{
                        color: "#895129",
                        fontSize: { xs: "25px", sm: "32px" },
                      }}
                    />
                  </Card>
                ))}
              </Card>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ padding: { xs: "5px", sm: "10px" } }}
          >
            <Grid item xs={12}>
              <Card
                sx={{
                  marginBottom: { xs: "5px", sm: "10px" },
                  padding: { xs: "5px", sm: "16px" },
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 2 },
                    mb: { xs: 1, sm: 3 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", sm: "18px", md: "20px" },
                      fontWeight: "bold",
                    }}
                    variant="h6"
                  >
                    Recent Posts
                  </Typography>
                </Box>

                <Box
                  sx={{
                    overflowX: "auto",
                    padding: { xs: "0 5px", sm: "0 15px" },
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "#f5f5f5",
                            "& th": {
                              fontWeight: "bold",
                              fontSize: { xs: "12px", sm: "16px" },
                              textAlign: "left",
                              padding: { xs: "8px 12px", sm: "12px 16px" },
                            },
                          }}
                        >
                          <TableCell>S No.</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>Post Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Publish Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {postList.map((post, index) => (
                          <TableRow
                            key={post.id}
                            sx={{
                              fontSize: { xs: "10px", sm: "15px" },
                              "&:hover": {
                                backgroundColor: "#FCF8E7",
                              },
                            }}
                          >
                            <TableCell
                              sx={{ fontSize: { xs: "10px", sm: "15px" } }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: { xs: "10px", sm: "15px" } }}
                            >
                              {formatNameLowerUpper(post?.author?.firstName)}{" "}
                              {formatNameLowerUpper(post?.author?.lastName)}
                            </TableCell>
                            <TableCell
                              sx={{
                                cursor: "pointer",
                                color: "#895129",
                                fontWeight: "bold",
                                fontSize: { xs: "10px", sm: "15px" },
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => {
                                const selectedCategory =
                                  post?.Categories?.[0]?._parentCategories ||
                                  post?.Categories?.[0]?.id;
                                const url = `${
                                  import.meta.env.VITE_API_LANDING_URL
                                }/news/${post?.permalink?.toLowerCase()}`;
                                if (post?.status === "PUBLISHED") {
                                  window.open(url, "_blank");
                                } else {
                                  localStorage.setItem("postId", post.id);
                                  navigate("/admin/posts/editPosts", {
                                    state: { activeItem: "All Posts" },
                                  });
                                }
                              }}
                            >
                              {truncateName(post.title)}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: { xs: "10px", sm: "15px" } }}
                            >
                              {post.Categories[0]?.name}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: { xs: "10px", sm: "15px" } }}
                            >
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(Dashboard);
