import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { styled } from "@mui/system";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    maxHeight: "50vh",
    overflowY: "auto",
    width: "400px",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#f44336",
  textAlign: "center",
  width: "80%",
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  fontSize: "0.7rem",
  color: "#333",
  textAlign: "center",
  padding: "0px",
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  display: "flex",
  justifyContent: "center",
  width: "80%",
  padding: "0px",
  gap: "1rem",
}));

const CancelButton = styled(Button)(() => ({
  color: "#abaaaa",
  border: "2px solid #abaaaa",
  fontSize: "0.8rem",
  padding: "0.6rem 3rem",
  borderRadius: "5px",
  minWidth: "120px",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "#abaaaa",
    color: "#fff",
  },
}));

const DeleteButton = styled(Button)(() => ({
  backgroundColor: "#f44336",
  color: "#fff",
  border: "2px solid #f44336",
  fontSize: "0.8rem",
  padding: "0.6rem 3rem",
  borderRadius: "5px",
  minWidth: "100px",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#f44336",
  },
}));

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <IconButton
        onClick={onClose}
        style={{
          color: "#ff6d4d",
          alignSelf: "center",
          padding: "0px",
        }}
      >
        <WarningAmberRoundedIcon
          style={{ fontSize: "8rem", transform: "scale(0.8)" }}
        />
      </IconButton>
      <StyledDialogTitle id="confirm-dialog-title">
        {"Confirm Deletion"}
      </StyledDialogTitle>
      <StyledDialogContent>
        <DialogContentText id="confirm-dialog-description">
          Are you sure you want to delete this item?
        </DialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        <CancelButton onClick={onClose} autoFocus>
          <strong>Cancel</strong>
        </CancelButton>
        <DeleteButton onClick={onConfirm}>
          <strong>Delete</strong>
        </DeleteButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;
