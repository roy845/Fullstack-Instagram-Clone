import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";

interface StoryDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const StoryDialog: React.FC<StoryDialogProps> = ({
  setOpen,
  open,
  children,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        Story
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "black" }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default StoryDialog;
