import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import TrackListsPage from './pages/TrackListsPage';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import ReportPage from './pages/ReportPage';
import HomePage from './pages/HomePage';
import { Container } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/track-lists" element={<TrackListsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;