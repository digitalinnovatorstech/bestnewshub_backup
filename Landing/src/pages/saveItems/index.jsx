import { memo, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Container,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingSaveItemList,
  landingRemoveSaveItemList,
} from "@/services/slices/landingSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { timeAgo } from "@/utility/helpers/globalHelpers";

const SaveItem = () => {
  const dispatch = useDispatch();
  const landingSaveItemList = useSelector(
    (state) => state.landing.landingSaveItemList
  );
  const [loadingView, setLoadingView] = useState(false);
  useEffect(() => {
    setLoadingView(true);
    dispatch(getLandingSaveItemList()).finally(() => {
      setLoadingView(false);
    });
  }, [dispatch]);

  const [openDialogUnsave, setOpenDialogUnsave] = useState(false);
  const [loadingUnsave, setLoadingUnsave] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleUnsave = async () => {
    if (!selectedPostId) return;
    setLoadingUnsave(true);
    try {
      await dispatch(landingRemoveSaveItemList(selectedPostId)).unwrap();
      dispatch({
        type: "landing/landingRemoveSaveItemList",
        payload: landingSaveItemList.filter(
          (item) => item.post.id !== selectedPostId
        ),
      });
      setOpenDialogUnsave(false);
      setSelectedPostId(null);
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setLoadingUnsave(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Typography
        variant="h6"
        sx={{
          color: "#7B3300",
          fontWeight: 600,
          mt: "1em",
          textAlign: "start",
        }}
      >
        Saved Posts
      </Typography>
      <Box sx={{ borderBottom: "1px solid #000000", mb: "1em" }} />
      <Box sx={{ maxWidth: { lg: 1200, xs: "100%" }, margin: "20px auto" }}>
        {landingSaveItemList?.length > 0 ? (
          landingSaveItemList.map((news, index) => (
            <Card
              key={news.id || index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "flex-start",
                marginBottom: 2,
                boxShadow: 0,
                border: "1px solid #000000",
                padding: "0.7em",
                paddingBottom: 0,
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", sm: "40%", lg: "345px" },
                  height: { xs: "150px", sm: "190px" },
                  objectFit: "cover",
                }}
                image={news.post.SEOImageUrl}
                alt={news.title}
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
                      fontWeight: 900,
                      fontSize: { xs: "14px", sm: "20px" },
                    }}
                  >
                    {news.post.metaTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "12px", sm: "14px" },
                    }}
                  >
                    {news.post.metaDescription}
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
                    {timeAgo(news?.post?.createdAt) || ""}
                  </Typography>
                </CardContent>
              </Box>
              <Box
                sx={{
                  position: { xs: "absolute", sm: "static" },
                  bottom: { xs: "20px ", sm: "unset" },
                  right: { xs: "18px ", sm: "unset" },

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "10px", sm: "14px" },
                    marginTop: { xs: 0.5 },
                    marginRight: 0.5,
                  }}
                >
                  Remove
                </Typography>
                <IconButton
                  onClick={() => {
                    setSelectedPostId(news?.post?.id);
                    setOpenDialogUnsave(true);
                  }}
                  sx={{
                    color: "text.secondary",
                    padding: { xs: "4px", sm: "8px" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Dialog
                  open={openDialogUnsave}
                  onClose={() => setOpenDialogUnsave(false)}
                >
                  <DialogContent sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>Confirm</Typography>
                    <Typography>
                      Are you sure you want to remove this post?
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Button
                        onClick={() => setOpenDialogUnsave(false)}
                        variant="outlined"
                        sx={{
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          mr: 2,
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUnsave}
                        variant="contained"
                        sx={{
                          bgcolor: "#895129",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#895129",
                          },
                        }}
                        disabled={loadingUnsave}
                      >
                        {loadingUnsave ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#895129" }}
                          />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    </Box>
                  </DialogContent>
                </Dialog>
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
            No saved posts available.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default memo(SaveItem);
