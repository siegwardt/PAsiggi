export interface Reservierung {
  id: string;
  title: string;
  date: string;
  info: string;
  status: 'reserviert' | 'gebucht' | 'frei' | 'blockiert';
  userId: string;
  equipment: string;
  address: string;
}
