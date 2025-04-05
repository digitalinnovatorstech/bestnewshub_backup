import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

export const SingleSelect = ({
  data,
  onChange,
  value = "",
  width = 200,
  placeholder = "Select...",
  disabled = false,
}) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ width }} size="small">
      <Select
        sx={{
          "& .MuiInputBase-input::placeholder": {
            fontSize: "0.8rem",
            color: "#895129",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#895129",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#895129",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#895129",
          },
        }}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        displayEmpty
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {data?.length > 0 ? (
          data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            {/* <em>No data available</em> */}
            <em>Loading...</em>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

// Add prop types validation
SingleSelect.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
