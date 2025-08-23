import express from 'express';
import apiRoutes from './routes';

const app = express();
const PORT = 5001;

app.use(express.json());

async function startServer() {
  try {
    app.get('/', (req, res) => {
      res.send('Please use /api!')
    });
    
    app.get('/api', (req, res) => {
      res.send('Succesfull connecion!')
    });
    
    app.use('/api/v1', apiRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}/api`);
    })
  } catch (err) {
  console.error('Database connection error:', err);
}};

startServer();
