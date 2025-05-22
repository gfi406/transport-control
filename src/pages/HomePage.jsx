import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, 
  CardContent, CircularProgress, Alert
} from '@mui/material';
import { 
  DirectionsCar as CarIcon,
  People as DriverIcon,
  Assignment as ListIcon,
  Timeline as ChartIcon
} from '@mui/icons-material';
import { getTrackLists, getCars, getDrivers } from '../api/transportApi';

const HomePage = () => {
  const [stats, setStats] = useState({
    activeLists: 0,
    totalLists: 0,
    vehicles: 0,
    drivers: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [trackListsRes, carsRes, driversRes] = await Promise.all([
        getTrackLists(),
        getCars(),
        getDrivers()
      ]);
      
      const now = new Date();
      
      const activeLists = trackListsRes.data.filter(tl => {
        
        if (tl.odometrEnd !== null) return false;
        
        if (!tl.validityPeriodEnd) return true;
        
        const endDate = new Date(tl.validityPeriodEnd);
        if (isNaN(endDate.getTime())) return true;
        
        return endDate > now;
      });
      
      setStats({
        activeLists: activeLists.length,
        totalLists: trackListsRes.data.length,
        vehicles: carsRes.data.length,
        drivers: driversRes.data.length,
        loading: false,
        error: null
      });
    } catch (err) {
      setStats(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  if (stats.loading) return <CircularProgress />;
  if (stats.error) return <Alert severity="error">{stats.error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в TransportControl
      </Typography>
      <Typography variant="body1" paragraph>
        Система управления путевыми листами и транспортными средствами
      </Typography>

      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ListIcon color="primary" fontSize="large" />
                <Box ml={2}>
                  <Typography variant="h6">Активные путевые листы</Typography>
                  <Typography variant="h4">{stats.activeLists}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ListIcon color="secondary" fontSize="large" />
                <Box ml={2}>
                  <Typography variant="h6">Всего путевых листов</Typography>
                  <Typography variant="h4">{stats.totalLists}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CarIcon color="success" fontSize="large" />
                <Box ml={2}>
                  <Typography variant="h6">Транспортных средств</Typography>
                  <Typography variant="h4">{stats.vehicles}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DriverIcon color="action" fontSize="large" />
                <Box ml={2}>
                  <Typography variant="h6">Водителей</Typography>
                  <Typography variant="h4">{stats.drivers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;