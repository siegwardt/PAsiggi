import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface BookingDialogProps {
  selectedDate: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isAdmin: boolean;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  selectedDate,
  onClose,
  onConfirm,
  isAdmin,
}) => {
  if (!selectedDate) return null;

  return (
    <Dialog
      open={!!selectedDate}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isAdmin ? 'Event reservieren' : 'Neuen Termin reservieren'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          {isAdmin
            ? `Möchten Sie den Termin am ${selectedDate} bestätigen?`
            : `Möchten Sie den Termin am ${selectedDate} reservieren?`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
        >
          {isAdmin ? 'Bestätigen' : 'Reservieren'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
