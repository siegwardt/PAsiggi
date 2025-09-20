import { useAuth } from '../contexts/AuthContext';
import { Typography } from '@mui/material';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <div>
            <h1>Willkommen zurück!</h1>
            <p>Hier ist der exklusive Inhalt für eingeloggte Benutzer.</p>
          </div>
          <div>
            <h2>Produkte finden</h2>
            <Typography
              component="a"
              href="/shop"
              sx={{
                fontWeight: "bold",
                color: "blue",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Produkte
            </Typography>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1>Willkommen auf unserer Seite!</h1>
            <p>Bitte loggen Sie sich ein, um exklusive Inhalte zu sehen.</p>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
