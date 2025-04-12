import { Reservierung } from "./types";

const RESERVIERUNGEN_URL = "/reservierungen.json";

export async function ladeReservierungen(): Promise<Reservierung[]> {
  try {
    const response = await fetch(RESERVIERUNGEN_URL);
    if (!response.ok) throw new Error(`Fehler beim Abrufen: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function erstelleReservierung(date: string, userId: string): Promise<Reservierung> {
  const reservierungen = await ladeReservierungen();
  const reservierung: Reservierung = {
    id: Date.now().toString(),
    title: "Reserviert",
    date,
    info: "Wartet auf Bestätigung",
    status: "reserviert",
    userId,
    equipment: "Keine Angabe",
    address: "Unbekannt",
  };

  reservierungen.push(reservierung);
  return reservierung;
}

export async function getReservierungen(userId?: string): Promise<Reservierung[]> {
  const reservierungen = await ladeReservierungen();
  if (userId) {
    return reservierungen.filter(r => r.userId === userId);
  }
  return reservierungen;
}

export async function bestaetigeReservierung(id: string): Promise<Reservierung | null> {
  const reservierungen = await ladeReservierungen();
  const reservierung = reservierungen.find(r => r.id === id);

  if (reservierung && reservierung.status === "reserviert") {
    reservierung.status = "gebucht";
    reservierung.title = "Gebucht";
    reservierung.info = "Vom Admin bestätigt";
    return reservierung;
  }

  return null;
}

export async function entferneReservierung(id: string): Promise<boolean> {
  const reservierungen = await ladeReservierungen();
  const index = reservierungen.findIndex(r => r.id === id);
  if (index !== -1) {
    reservierungen.splice(index, 1);
    return true;
  }

  return false;
}

export type { Reservierung };
