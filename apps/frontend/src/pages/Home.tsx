import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingCalendar from '../components/kalender/BookingCalendar';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Willkommen zurück!</h1>
          <p>Hier ist der exklusive Inhalt für eingeloggte Benutzer.</p>
        </div>
      ) : (
        <>
          <div>
            <h1>Willkommen auf unserer Seite!</h1>
            <p>Bitte loggen Sie sich ein, um exklusive Inhalte zu sehen.</p>
          </div>
          <BookingCalendar isAdmin={false} userId='85123' />
        </>
      )}
    </div>
  );
};

export default Home;
