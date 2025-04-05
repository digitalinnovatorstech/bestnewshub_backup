import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import {
  ExpandLess,
  ExpandMore,
  Description,
  InfoOutlined,
} from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { DeleteOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategoryToHome,
  deleteCategoryFromHome,
  getCategoriesList,
  getCategoryHomeAdmin,
} from "../../../services/slices/categoriesSlice";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../utility/hook/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const transformData = (categories) => {
  const categoryId = "category-1";
  return {
    categories: {
      [categoryId]: {
        name: "Home Page Category",
        tasks: categories.map((cat) => ({
          id: cat.id, // Correct object syntax inside map()
          name: cat.name,
        })),
      },
    },
    categoryOrder: [categoryId],
  };
};

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({});
  const categoriesList = useSelector(
    (state) => state.categories.categoriesList
  );
  const adminCategoryHome = useSelector(
    (state) => state.categories.adminCategoryHome
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getCategoriesList()).finally(() => {
      setLoading(false);
    });
    dispatch(getCategoryHomeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (categoriesList?.length) {
      setLocalCategories(categoriesList);
    }
  }, [categoriesList]);

  // const categoryId = localStorage.getItem("categoryId");
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const initialData = transformData(adminCategoryHome);
  const [boardData, setBoardData] = useState(initialData);
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    if (adminCategoryHome && adminCategoryHome.length > 0) {
      setBoardData(transformData(adminCategoryHome));
    }
  }, [adminCategoryHome]);

  const deleteCategory = async () => {
    setLoadingDelete(true);
    try {
      const response = await api.delete(`/admin/category/delete/${selectedId}`);
      toast.success(response.data.message);
      await dispatch(getCategoriesList()).unwrap();
      setSelectedId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleClick = (categoryId) => {
    setOpen((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  // Recursive function to render categories and their children
  const renderCategoryItem = (category) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
      <Box key={category.id}>
        {/* Main Category */}
        <ListItem
          button
          onClick={() => {
            handleClick(category.id);
          }}
          sx={{ pl: 2, mb: 2, border: "1px solid #ccc" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <Checkbox /> */}
            <Description sx={{ mr: 1 }} />
            <Switch
              checked={category.isHome === 1}
              onChange={async (e) => {
                const newValue = e.target.checked ? 1 : 0;
                setLocalCategories((prevCategories) =>
                  prevCategories.map((cat) =>
                    cat.id === category.id ? { ...cat, isHome: newValue } : cat
                  )
                );
                setLoading(true);
                try {
                  const action = newValue
                    ? await dispatch(
                        addCategoryToHome({ categoryId: category.id })
                      ).unwrap()
                    : await dispatch(
                        deleteCategoryFromHome({ categoryId: category.id })
                      ).unwrap();
                  toast.success(action?.message || "Operation successful");
                  dispatch(getCategoriesList()).finally();
                  dispatch(getCategoryHomeAdmin());
                } catch (error) {
                  toast.error(
                    error?.message || "Failed to update category status."
                  );
                  setLocalCategories((prevCategories) =>
                    prevCategories.map((cat) =>
                      cat.id === category.id
                        ? { ...cat, isHome: category.isHome }
                        : cat
                    )
                  );
                } finally {
                  setLoading(false);
                }
              }}
              sx={{
                zIndex: 1000,
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#895129",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#895129",
                },
              }}
            />
            <Tooltip
              title={
                <Box sx={{ p: 1, maxWidth: 300 }}>
                  <Typography variant="body2">
                    To feature this category on the home page, turn the toggle
                    ON. To remove it, turn the toggle OFF.
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      fontSize: "0.75rem",
                      padding: "4px",
                      borderRadius: "4px",
                      overflowX: "auto",
                    }}
                  >
                    {``}
                  </Box>
                </Box>
              }
              arrow
            >
              <InfoOutlined
                sx={{
                  fontSize: 18,
                  marginLeft: 0.5,
                  marginRight: 1,

                  cursor: "pointer",
                  color: "#555",
                }}
              />
            </Tooltip>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <ListItemText primary={category.name} />
              {hasChildren ? (
                open[category.id] ? (
                  <ExpandLess sx={{ mt: "5px" }} />
                ) : (
                  <ExpandMore sx={{ mt: "5px" }} />
                )
              ) : null}
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="end"
              onClick={() => {
                // localStorage.setItem("categoryId", category.id);
                setSelectedId(category.id);
                navigate(`/admin/categories/editCategories?id=${category.id}`);
              }}
            >
              <EditNoteIcon sx={{ color: "#206BC4" }} />
            </IconButton>
            <IconButton
              edge="end"
              sx={{ ml: 2 }}
              onClick={() => {
                setSelectedId(category.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <DeleteOutlined sx={{ color: "#f44336" }} />
            </IconButton>
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
                  onClick={() => setIsDeleteDialogOpen(false)}
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
                  onClick={deleteCategory}
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
        </ListItem>

        {/* Render Subcategories */}
        {hasChildren && (
          <Collapse in={open[category.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children.map((child) => (
                <Box key={child.id} sx={{ pl: 4 }}>
                  {renderCategoryItem(child)}
                </Box>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const onDragEnd = async (result) => {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    let taskData = {};
    try {
      taskData = JSON.parse(draggableId);
    } catch (error) {
      console.error("Error parsing draggableId:", error);
      return;
    }

    if (type === "category") {
      const newCategoryOrder = [...boardData.categoryOrder];
      const [movedCategory] = newCategoryOrder.splice(source.index, 1);
      newCategoryOrder.splice(destination.index, 0, movedCategory);
      setBoardData({ ...boardData, categoryOrder: newCategoryOrder });
      return;
    }

    if (type === "task") {
      const sourceCategory = boardData.categories[source.droppableId];
      const destinationCategory = boardData.categories[destination.droppableId];

      const sourceTasks = [...sourceCategory.tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceTasks.splice(destination.index, 0, movedTask);
        setBoardData({
          ...boardData,
          categories: {
            ...boardData.categories,
            [source.droppableId]: { ...sourceCategory, tasks: sourceTasks },
          },
        });
      } else {
        const destinationTasks = [...destinationCategory.tasks];
        destinationTasks.splice(destination.index, 0, movedTask);
        setBoardData({
          ...boardData,
          categories: {
            ...boardData.categories,
            [source.droppableId]: { ...sourceCategory, tasks: sourceTasks },
            [destination.droppableId]: {
              ...destinationCategory,
              tasks: destinationTasks,
            },
          },
        });
      }

      try {
        await api.put("/admin/category/home/changePosition", {
          categoryId: taskData.id,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          sourceCategoryId: source.droppableId,
          destinationCategoryId: destination.droppableId,
        });
      } catch (error) {
        console.error("Error updating task order:", error);
      }
    }
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "15px",
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
            sx={{ cursor: "pointer", color: "#895129" }}
            onClick={() => navigate("/admin/categories")}
          >
            CATEGORIES
          </Typography>
        </Stack>
        <Stack
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "row",
            // flexDirection: isTabMode ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: "68%",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              background: "#fff",
            }}
          >
            {" "}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  navigate("/admin/categories/addCategories", {
                    state: { activeItem: "New Categories" },
                  })
                }
                sx={{
                  marginTop: "10px",
                  bgcolor: "#895129",
                  justifyContent: "end",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#895129",
                  },
                }}
              >
                Create
              </Button>
            </Box>
            <List>
              {categoriesList?.map((category) => renderCategoryItem(category))}
            </List>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            <Box
              sx={{
                background: "#fff",
                // padding: "10px 0px",
                display: { xs: "none", sm: "block" },
              }}
            >
              {/* <Typography variant="h6">Add New Categories</Typography> */}
              {/* <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    navigate("/admin/categories/addCategories", {
                      state: { activeItem: "New Categories" },
                    })
                  }
                  sx={{
                    marginTop: "10px",
                    bgcolor: "#895129",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#895129",
                    },
                  }}
                >
                  Create
                </Button>
              </Box> */}

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="all-categories"
                  type="category"
                  direction="horizontal"
                >
                  {(provided) => (
                    <Box
                      display="flex"
                      gap={3}
                      p={2}
                      overflow="auto"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {boardData.categoryOrder.map((categoryId, index) => {
                        const category = boardData.categories[categoryId];
                        return (
                          <Draggable>
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                sx={{
                                  minWidth: "100%",
                                  // background: "#f4f4f4",
                                  p: 2,
                                  borderRadius: 0,
                                  boxShadow: "none",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  {...provided.dragHandleProps}
                                  textAlign="center"
                                  fontWeight="bold"
                                  sx={{ cursor: "default" }}
                                >
                                  {category.name}
                                </Typography>
                                <Droppable droppableId={categoryId} type="task">
                                  {(provided) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      sx={{
                                        minHeight: 100,
                                        p: 1,
                                        // background: "#e0e0e0",
                                        // borderRadius: 2,
                                        mt: 2,
                                      }}
                                    >
                                      {category?.tasks?.map(
                                        (task, taskIndex) => {
                                          return (
                                            <Draggable
                                              key={task.id}
                                              draggableId={JSON.stringify({
                                                id: task.id,
                                                name: task.name,
                                              })}
                                              index={taskIndex}
                                            >
                                              {(provided) => (
                                                <Card
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  sx={{
                                                    mb: 2,
                                                    backgroundColor: "#fff",
                                                    boxShadow: 4,
                                                    cursor: "grab",
                                                  }}
                                                >
                                                  <CardContent>
                                                    <Typography>
                                                      {task?.name ||
                                                        "Unnamed Task"}
                                                    </Typography>
                                                  </CardContent>
                                                </Card>
                                              )}
                                            </Draggable>
                                          );
                                        }
                                      )}
                                      {provided.placeholder}
                                    </Box>
                                  )}
                                </Droppable>
                                {provided.placeholder}
                              </Paper>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(Categories);
