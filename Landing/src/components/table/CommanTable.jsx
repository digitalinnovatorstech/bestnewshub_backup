import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  TablePagination,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "./ConfirmationDialog";
import moment from "moment";

const CommanTable = ({ rows, headCells, onDelete, onEdit, onPreview }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filter1, setFilter1] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    const newSelected = selected.includes(id)
      ? selected?.filter((item) => item !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  function formatDate(dateString) {
    return moment(dateString).format("DD-MM-YYYY");
  }
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  let filteredRows = rows
    .filter((row) => {
      const searchMatch = Object.values(row).some((value) =>
        String(value)?.toLowerCase().includes(search?.toLowerCase())
      );
      const filter1Match = filter1 ? row.filterField1 === filter1 : true;
      return searchMatch && filter1Match;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDelete = (row) => {
    setRowToDelete(row);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    if (row) {
      onEdit(row.id);
    }
  };

  const handlePreview = (row) => {
    if (row) {
      onPreview(row.id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const confirmDelete = () => {
    if (rowToDelete) {
      onDelete(rowToDelete);
    }
    handleDialogClose();
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      backgroundColor: "#4CAF50",
      borderRadius: "5px",
      color: "white",
      fontFamily: "sans-serif",
      width: "90px",
      display: "inline-block",
      textAlign: "center",
    };
    switch (status) {
      case "PUBLISHED":
        return { ...baseStyle, backgroundColor: "#4CAF50" }; // Green
      case "PENDING":
        return { ...baseStyle, backgroundColor: "#FFC107" }; // Yellow/Orange
      case "Archived":
        return { ...baseStyle, backgroundColor: "#F44336" }; // Red
      default:
        return baseStyle;
    }
  };

  const truncateName = (name) => {
    const words = name?.split(" ");
    return words?.length > 2 ? `${words?.slice(0, 2).join(" ")}...` : name;
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "#ECF0F3" }}>
            <TableRow sx={{ height: "40px" }}>
              <TableCell
                padding="checkbox"
                sx={{ backgroundColor: "#ECF0F3" }}
              ></TableCell>
              {headCells?.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    color: "#6C8398",
                    paddingTop: "10px",
                    padding: "0px",
                    width: "0px",
                    fontSize: "0.875rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#ECF0F3",
                    zIndex: 1,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, headCell.id)}
                  >
                    <span>{headCell.label}</span>
                    {orderBy === headCell.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.sort(getComparator(order, orderBy)).map((row) => {
              const isItemSelected = selected.includes(row.id);
              return (
                <TableRow
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ height: "60px", border: "none" }}
                >
                  <TableCell padding="checkbox" sx={{ border: "none" }}>
                    {/* <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": `table-checkbox-${row.id}`,
                      }}
                    /> */}
                  </TableCell>
                  {headCells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      align={cell.numeric ? "right" : "left"}
                      sx={{
                        paddingTop: "5px",
                        fontSize: "0.875rem",
                        padding: "0px",
                        // color: cell.id === "name" ? "blue" : "inherit",
                        // cursor: cell.id === "name" ? "pointer" : "default",
                        height: "30px",
                        border: "none",
                      }}
                    >
                      {cell.image === true ? (
                        <img
                          src={row[cell.id]}
                          alt=""
                          width="50px"
                          height="50px"
                          style={{ borderRadius: "2px" }}
                        />
                      ) : cell.date === true ? (
                        formatDate(row.id)
                      ) : cell.id === "status" ? (
                        <span style={getStatusStyle(row[cell.id])}>
                          {row[cell.id]}{" "}
                        </span>
                      ) : cell.id === "title" || cell.id === "name" ? (
                        <>
                          <span>{truncateName(row[cell.id])}</span>
                          {hoveredRow === row.id && cell.operation && (
                            <Box
                              sx={{
                                marginTop: "10px",
                                display: "flex",
                              }}
                            >
                              {cell.operation.edit && (
                                <Typography
                                  sx={{
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                    color: "blue",
                                  }}
                                  onClick={() => handleEdit(row.id)}
                                >
                                  | Edit |
                                </Typography>
                              )}
                              {cell.operation.delete && (
                                <Typography
                                  sx={{
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                    color: "red",
                                  }}
                                  onClick={() => handleDelete(row.id)}
                                >
                                  | Trash |
                                </Typography>
                              )}
                              {cell.operation.preview && (
                                <Typography
                                  sx={{
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                    color: "green",
                                  }}
                                  onClick={() => handlePreview(row.id)}
                                >
                                  | Preview |
                                </Typography>
                              )}
                            </Box>
                          )}
                        </>
                      ) : (
                        row[cell.id]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25, 35, 50, 75, 100, 200]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={confirmDelete}
      />

      <ToastContainer />
    </div>
  );
};

CommanTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headCells: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

export default CommanTable;
