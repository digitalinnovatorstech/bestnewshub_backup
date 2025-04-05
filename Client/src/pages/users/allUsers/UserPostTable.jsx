import PropTypes from "prop-types";
import {
  Grid,
  Container,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { memo } from "react";

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
  height: "35px",
  fontSize: "12px",
}));

const UserPostTable = ({ columns, rows, loading, setLoading }) => {
  const fixedHeaderContent = () => (
    <TableHead>
      <TableRow>
        {columns?.map((column) => (
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

    return (
      <StyledTableRow key={row.id}>
        {columns.map((column) => (
          <TableCell
            key={column.field}
            style={{ textAlign: "center", padding: "4px 8px" }}
          >
            {column.field === "sNo"
              ? index + 1
              : column?.renderCell
              ? column.renderCell({ row })
              : row[column.field]}
          </TableCell>
        ))}
      </StyledTableRow>
    );
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
              height: 300,
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
              height: 300,
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
              sx={{ fontSize: "12px", height: "auto", overflowY: "auto" }}
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
      </Grid>
    </Container>
  );
};

UserPostTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default memo(UserPostTable);
