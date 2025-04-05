import PropTypes from "prop-types";
import {
  Grid,
  Container,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Stack,
  useMediaQuery,
  Checkbox,
} from "@mui/material";
import { memo, useEffect, useState } from "react";

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: "15px 8px",
  // lineHeight: 4,
  height: "50px",
  backgroundColor: "#FCF8E7",
  color: "#895129",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // "&:last-child td, &:last-child th": {
  //   border: 0,
  // },
  height: "35px",
  fontSize: "12px",
}));

const PaginatedTable = ({
  columns,
  rows,
  loading,
  totalPages,
  page,
  totalData,
  onPageChange,
  setLoading,
  height,
  rowsPerPage,
  handleRowsPerPageChange,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  handleSelectAllChange,
  handleRowCheckboxChange,
}) => {
  // const rowsPerPage = 10;
  const isTabMode = useMediaQuery("(max-width: 768px)");
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [selectAll, setSelectAll] = useState(false);

  // const handleSelectAllChange = (event) => {
  //   if (event.target.checked) {
  //     setSelectedRows(rows.map((row) => row.id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  //   setSelectAll(event.target.checked);
  // };

  // const handleRowCheckboxChange = (rowId) => {
  //   const newSelectedRows = selectedRows.includes(rowId)
  //     ? selectedRows.filter((id) => id !== rowId)
  //     : [...selectedRows, rowId];

  //   setSelectedRows(newSelectedRows);
  // };

  useEffect(() => {
    setSelectAll(rows.length > 0 && selectedRows.length === rows.length);
  }, [selectedRows, rows]);

  const fixedHeaderContent = () => (
    <TableHead>
      <TableRow>
        <StyledTableCell
          style={{
            textAlign: "center",
            padding: "2px 8px",
            lineHeight: "2",
            fontWeight: "bold",
          }}
        >
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAllChange}
            indeterminate={
              selectedRows.length > 0 && selectedRows.length < rows.length
            }
            sx={{
              color: selectAll ? "#895129" : "#895129",
              "&.Mui-checked": {
                color: "#895129",
              },
            }}
          />
        </StyledTableCell>
        {columns.map((column) => (
          <StyledTableCell
            key={column.field}
            style={{
              flex: column.flex,
              padding: "2px 8px",
              lineHeight: "2",
              fontWeight: "bold",
            }}
          >
            {column.headerName}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const rowContent = (index) => {
    const row = rows[index];
    const serialNumber = (page - 1) * rowsPerPage + index + 1;

    return (
      <StyledTableRow key={row.id}>
        <TableCell padding="checkbox" style={{ textAlign: "center" }}>
          <Checkbox
            checked={selectedRows.includes(row.id)}
            onChange={() => handleRowCheckboxChange(row.id)}
            sx={{
              color: selectedRows.includes(row.id) ? "#895129" : "#895129",
              "&.Mui-checked": {
                color: "#895129",
              },
            }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={column.field}
            style={{ textAlign: "center", padding: "4px 8px" }}
          >
            {column.field === "sNo"
              ? serialNumber
              : column.renderCell
              ? column.renderCell({ row })
              : column.date
              ? new Date(row[column.field]).toLocaleDateString()
              : row[column.field]}
          </TableCell>
        ))}
      </StyledTableRow>
    );
  };

  const handlePageChange = (event, value) => {
    setLoading(true);
    onPageChange(value);
    setLoading(false);
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{ background: "#fff", border: "1px solid #895129" }}
    >
      <Grid item xs={12}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: { height },
            }}
          >
            <CircularProgress sx={{ color: "#895129" }} />
          </Box>
        ) : rows?.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: { height },
            }}
          >
            <Typography variant="h6">No Data Available</Typography>
          </Box>
        ) : (
          <Paper
            sx={{
              height: "auto",
              width: "100%",
              overflow: "hidden",
              boxShadow: "none",
            }}
          >
            <TableContainer
              sx={{ fontSize: "12px", height: { height }, overflowY: "auto" }}
            >
              <Table stickyHeader sx={{ fontSize: "12px" }}>
                {fixedHeaderContent()}
                <TableBody sx={{ fontSize: "12px", borderBottom: "none" }}>
                  {rows?.map((_, index) => rowContent(index))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {rows?.length > 0 && (
          <Stack
            sx={{
              display: "flex",
              // flexDirection: "row",
              flexDirection: isTabMode ? "column" : "row",
              justifyContent: "space-between",
              width: "100%",
              p: 1,
            }}
            mt={1}
          >
            {isTabMode ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    gap: 1,
                    padding: "4px 8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500, minWidth: "60px", color: "#895129" }}
                  >
                    Showing
                  </Typography>
                  <Box
                    component="select"
                    // defaultValue={rowsPerPage}
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    sx={{
                      padding: "6px 12px",
                      border: "1px solid #895129",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      backgroundColor: "#FCF8E7",
                      color: "#895129",
                      minWidth: "60px",
                      outline: "none",
                      "&:focus": {
                        borderColor: "#895129",
                      },
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                  {rows?.length > 0 ? (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#895129" }}
                    >
                      {`Showing ${
                        Math.min((page - 1) * rowsPerPage + 1, totalData) || 0
                      } to ${
                        Math.min(page * rowsPerPage, totalData) || 0
                      } out of ${totalData || 0} records`}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            ) : (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    gap: 1,
                    padding: "4px 8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500, minWidth: "60px", color: "#895129" }}
                  >
                    Showing
                  </Typography>
                  <Box
                    component="select"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    sx={{
                      padding: "6px 12px",
                      border: "1px solid #895129",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      backgroundColor: "#FCF8E7",
                      color: "#895129",
                      minWidth: "60px",
                      outline: "none",
                      "&:focus": {
                        borderColor: "#895129",
                      },
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                  {rows?.length > 0 ? (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#895129" }}
                    >
                      {`Showing ${
                        Math.min((page - 1) * rowsPerPage + 1, totalData) || 0
                      } to ${
                        Math.min(page * rowsPerPage, totalData) || 0
                      } out of ${totalData || 0} records`}
                    </Typography>
                  ) : null}
                </Box>
              </>
            )}
            <Box display="flex" justifyContent="flex-end">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "0.875rem",
                    color: "#895129",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#FCF8E7",
                  },
                }}
              />
            </Box>
          </Stack>
        )}
      </Grid>
    </Container>
  );
};

PaginatedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  totalPages: PropTypes.number,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  totalData: PropTypes.number,
  height: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selectedRows: PropTypes.array,
  setSelectedRows: PropTypes.func,
  selectAll: PropTypes.bool,
  setSelectAll: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func,
  handleSelectAllChange: PropTypes.func,
  handleRowCheckboxChange: PropTypes.func,
};

export default memo(PaginatedTable);
