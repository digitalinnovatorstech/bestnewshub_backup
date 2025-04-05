import {
  Grid,
  Typography,
  Button,
  Avatar,
  Box,
  Container,
  Stack,
  CardContent,
  CardMedia,
  Card,
  Pagination,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";
import user1Image from "@/assets/author/comment.png";
import user2Image from "@/assets/author/comment.png";
import user3Image from "@/assets/author/comment.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import { timeAgo } from "@/utility/helpers/globalHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPostList } from "@/services/slices/postSlice";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useRouter } from "next/router";

const BlogDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loadingT, setLoadingT] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 5,
  });
  const postStore = useSelector((state) => state.post);
  const postList = postStore.postList;
  const [filteredList, setFilteredList] = useState(postList || []);
  useEffect(() => {
    setFilteredList(postList);
  }, [postList]);

  const fetchData = async () => {
    setLoadingT(true);
    try {
      const payload = {
        params: {
          currentPage: paginationModel.page,
          perPage: paginationModel.pageSize,
        },
      };
      await dispatch(getPostList(payload));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingT(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  useEffect(() => {
    setTotalCount(postStore?.paginationModel?.totalItems || 0);
  }, [postStore.paginationModel]);

  const handlePaginationChange = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const comments = [
    {
      id: 1,
      userName: "Sienna",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, suscipit exercitationem accusantium obcaecati quos voluptate nesciunt       Read more>",
      date: "23-11-2024 | 02:30 PM",
      avatar: user1Image,
    },
    {
      id: 2,
      userName: "Sienna",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, suscipit exercitationem accusantium obcaecati quos voluptate nesciunt       Read more>",
      date: "23-11-2024 | 02:30 PM",
      avatar: user2Image,
    },
    {
      id: 3,
      userName: "Sienna",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, suscipit exercitationem accusantium obcaecati quos voluptate nesciunt       Read more>",
      date: "23-11-2024 | 02:30 PM",
      avatar: user3Image,
    },
  ];

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <ToastContainer />
      <Stack
        sx={{
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                heigth: "auto",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Post
                </Typography>
                {/* <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: "#895129",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#895129",
                    },
                  }}
                  onClick={() => router.push("/author/authorpost")}
                >
                  Create Post
                </Button> */}
              </Box>
              <Box
                sx={{ maxWidth: { lg: 1000, xs: "100%" }, margin: "20px auto" }}
              >
                {loadingT ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "200px",
                    }}
                  >
                    <CircularProgress sx={{ color: "#895129" }} />
                  </Box>
                ) : filteredList?.length > 0 ? (
                  filteredList.map((news, index) => (
                    <Card
                      key={news.id || index}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", sm: "row" },
                        alignItems: "flex-start",
                        marginBottom: 2,
                        boxShadow: 0,
                        border: "1px solid #000000",
                        padding: "0.7em",
                        paddingBottom: 0,
                        position: "relative",
                      }}
                    >
                      {/* <IconButton
                        aria-label="edit"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "white",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                          zIndex: 1,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", news?.id);
                          window.open("/admin/posts/editPosts", "_blank");
                        }}
                      >
                        <EditNoteIcon />
                      </IconButton> */}
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: "40%", sm: "345px" },
                          height: { xs: "150px", sm: "190px" },
                          objectFit: "cover",
                        }}
                        image={news?.SEOImageUrl}
                        alt={news.title}
                        onClick={() => {
                          router.push({
                            pathname: `/News/${news?.permalink}`,
                            query: {
                              selectedCategory:
                                news?.Categories?.[0]?._parentCategories ||
                                news?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          paddingLeft: { xs: "1em", sm: "1.5em" },
                        }}
                      >
                        <CardContent
                          sx={{
                            flex: "1 0 auto",
                            textAlign: "left",
                            padding: 0,
                          }}
                        >
                          <Typography
                            component="div"
                            variant="h6"
                            sx={{
                              maxWidth: { lg: "60%" },
                              fontWeight: 900,
                              fontSize: { xs: "14px", sm: "24px" },
                              "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={() => {
                              router.push({
                                pathname: `/News/${news?.permalink}`,
                                query: {
                                  selectedCategory:
                                    news?.Categories?.[0]?._parentCategories ||
                                    news?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                          >
                            {news.metaTitle}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "12px", sm: "16px" },
                            }}
                          >
                            {news.metaDescription}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              marginTop: { lg: 1, xs: 1 },
                              fontSize: { xs: "10px", sm: "12px" },
                              display: "block",
                            }}
                          >
                            {timeAgo(news?.createdAt) || ""}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      marginTop: 4,
                      fontSize: { xs: "14px", sm: "18px" },
                      color: "text.secondary",
                    }}
                  >
                    No posts available.
                  </Typography>
                )}
                {!loadingT && (
                  <Pagination
                    count={Math.ceil(totalCount / paginationModel.pageSize)}
                    page={paginationModel.page}
                    onChange={handlePaginationChange}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                      "& .MuiPaginationItem-root": {
                        fontSize: "0.875rem",
                        color: "#895129",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#FCF8E7",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                padding: "20px",
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}
              >
                Comments
              </Typography>

              <Box>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Avatar
                        src={comment.avatar || "/default-avatar.png"}
                        alt={comment.userName}
                        sx={{
                          width: 50,
                          height: 50,
                          marginRight: "15px",
                          border: "2px solid #895129",
                        }}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#3BB77E" }}
                          >
                            {comment.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#888" }}>
                            {comment.date}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#555",
                            lineHeight: 1.6,
                            fontSize: { xs: "14px", md: "16px" },
                            marginBottom: "12px",
                            textAlign: "justify",
                          }}
                        >
                          {comment.text.length > 100
                            ? `${comment.text.substring(0, 100)}...`
                            : comment.text}
                          {comment.text.length > 100 && (
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                cursor: "pointer",
                                color: "#895129",
                                marginLeft: "5px",
                                fontWeight: 500,
                              }}
                            >
                              Read more
                            </Typography>
                          )}
                        </Typography>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          <Typography
                            variant="button"
                            sx={{
                              cursor: "pointer",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              color: "#895129",
                            }}
                          >
                            Like
                            <ThumbUpIcon
                              sx={{
                                fontSize: "18px",
                                marginLeft: "5px",
                                color: "#895129",
                              }}
                            />
                          </Typography>
                          <Typography
                            variant="button"
                            sx={{
                              cursor: "pointer",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              color: "#895129",
                            }}
                          >
                            Reply
                            <SendIcon
                              sx={{
                                fontSize: "18px",
                                marginLeft: "5px",
                                color: "#895129",
                              }}
                            />
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", textAlign: "center" }}
                  >
                    No comments yet. Be the first to comment!
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default BlogDashboard;
