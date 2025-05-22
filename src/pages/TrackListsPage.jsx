import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, 
  CircularProgress, Alert, Button
} from '@mui/material';
import TrackListTable from '../components/TrackList/TrackListTable';
import { getTrackLists } from '../api/transportApi';

const TrackListsPage = () => {
  const [trackLists, setTrackLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchTrackLists();
  }, []);

  const fetchTrackLists = async () => {
    try {
      setLoading(true);
      const response = await getTrackLists();
      setTrackLists(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const now = new Date(); 

  const activeTrackLists = trackLists.filter(tl => {
    if (tl.odometrEnd !== null) return false; 
    if (!tl.validityPeriodEnd) return true; 
    const endDate = new Date(tl.validityPeriodEnd);
    if (isNaN(endDate.getTime())) return true; 
    return endDate > now;
  });

  const completedTrackLists = trackLists.filter(tl => {
    return tl.odometrEnd !== null; 
  });

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Управление путевыми листами
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`Активные (${activeTrackLists.length})`} />
        <Tab label={`Завершенные (${completedTrackLists.length})`} />
        <Tab label={`Все (${trackLists.length})`} />
      </Tabs>
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => fetchTrackLists()}
        >
          Обновить данные
        </Button>
      </Box>

      <Box mt={2}>
        {tabValue === 0 && (
          <TrackListTable 
            trackLists={activeTrackLists} 
            onUpdate={fetchTrackLists}
          />
        )}
        {tabValue === 1 && (
          <TrackListTable 
            trackLists={completedTrackLists} 
            onUpdate={fetchTrackLists}
          />
        )}
        {tabValue === 2 && (
          <TrackListTable 
            trackLists={trackLists} 
            onUpdate={fetchTrackLists}
          />
        )}
      </Box>
    </Box>
  );
};

export default TrackListsPage;