import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EventApi } from '@fullcalendar/core';

interface EventCardProps {
  event: EventApi | null;
  onClose: () => void;
  isAdmin: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClose, isAdmin }) => {
  if (!event) return null;

  const { title, start, extendedProps } = event;
  const { customer, info, equipment, address, category } = extendedProps ?? {};

  return (
    <Dialog open={!!event} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title ?? 'Kein Titel verfügbar'}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Datum: </strong>
          {start ? new Date(start).toLocaleDateString() : 'Kein Datum vorhanden'}
        </Typography>
        {isAdmin ? (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Kunde: </strong>
              {customer ?? 'Nicht verfügbar'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Info: </strong>
              {info ?? 'Keine zusätzlichen Informationen'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Equipment: </strong>
              {equipment ?? 'Keine Angaben'}
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Adresse anzeigen</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{address ?? 'Keine Adresse angegeben'}</Typography>
              </AccordionDetails>
            </Accordion>
          </>
        ) : (
          <Typography variant="body2" gutterBottom>
            <strong>Status: </strong>
            {category ?? 'Unbekannt'}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventCard;
