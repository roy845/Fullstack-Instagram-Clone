import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  content: string;
  handleFunction: () => Promise<void>;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  setOpen,
  title,
  content,
  handleFunction,
}) => {
  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {content}
          </DialogContentText>
        </DialogContent>

        <section
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            Discard
          </Button>
          <Button
            onClick={handleFunction}
            autoFocus
            sx={{
              backgroundColor: "#2074d4",
              color: "white",
              "&:hover": { backgroundColor: "#2074d4" },
            }}
          >
            OK
          </Button>
        </section>
      </Dialog>
    </React.Fragment>
  );
};

export default AlertDialog;
