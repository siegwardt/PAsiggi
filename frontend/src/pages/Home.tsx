import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Willkommen zurück!</h1>
          <p>Hier ist der exklusive Inhalt für eingeloggte Benutzer.</p>
          {/* Weitere Inhalte für eingeloggte Benutzer */}
        </div>
      ) : (
        <div>
          <h1>Willkommen auf unserer Seite!</h1>
          <p>Bitte loggen Sie sich ein, um exklusive Inhalte zu sehen.</p>
          {/* Weitere Inhalte für nicht eingeloggte Benutzer */}
        </div>
      )}
    </div>
  );
};

export default Home;
