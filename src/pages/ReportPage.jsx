import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, 
  CircularProgress, Alert, Button,
  Grid, Paper
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getTrackLists, getCars } from '../api/transportApi';
import { format, subDays } from 'date-fns';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [trackLists, setTrackLists] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trackListsRes, vehiclesRes] = await Promise.all([
        getTrackLists(),
        getCars()
      ]);
      setTrackLists(trackListsRes.data);
      setVehicles(vehiclesRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (name) => (date) => {
    setDateRange(prev => ({ ...prev, [name]: date }));
  };

  const getFuelConsumptionData = () => {
    const vehicleMap = {};
    
    vehicles.forEach(vehicle => {
      vehicleMap[vehicle.id] = {
        name: vehicle.carName,
        fuelUsed: 0,
        distance: 0
      };
    });

    trackLists.forEach(trackList => {
      if (trackList.car && trackList.trackPoints) {
        const distance = trackList.trackPoints.reduce((sum, point) => sum + point.distanceTraveled, 0);
        const fuelUsed = distance * trackList.car.carFuelUsing / 100;
        
        if (vehicleMap[trackList.car.id]) {
          vehicleMap[trackList.car.id].fuelUsed += fuelUsed;
          vehicleMap[trackList.car.id].distance += distance;
        }
      }
    });

    return Object.values(vehicleMap).map(vehicle => ({
      name: vehicle.name,
      'Расход топлива (л)': parseFloat(vehicle.fuelUsed.toFixed(2)),
      'Пробег (км)': vehicle.distance
    }));
  };

  const getDriverActivityData = () => {
    const driverMap = {};
    
    trackLists.forEach(trackList => {
      if (trackList.driver) {
        const key = trackList.driver.id;
        if (!driverMap[key]) {
          driverMap[key] = {
            name: trackList.driver.driverName,
            trips: 0,
            distance: 0
          };
        }
        driverMap[key].trips += 1;
        driverMap[key].distance += trackList.trackPoints?.reduce((sum, point) => sum + point.distanceTraveled, 0) || 0;
      }
    });

    return Object.values(driverMap).map(driver => ({
      name: driver.name,
      'Количество рейсов': driver.trips,
      'Общий пробег (км)': driver.distance
    }));
  };

  const getVehicleUsageData = () => {
    return vehicles.map(vehicle => {
      const trips = trackLists.filter(tl => tl.car?.id === vehicle.id).length;
      return {
        name: vehicle.carName,
        value: trips
      };
    }).filter(item => item.value > 0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Аналитика и отчеты
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Дата начала"
              value={dateRange.start}
              onChange={handleDateChange('start')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Дата окончания"
              value={dateRange.end}
              onChange={handleDateChange('end')}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={dateRange.start}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Расход топлива" />
        <Tab label="Активность водителей" />
        <Tab label="Использование транспорта" />
      </Tabs>

      <Box mt={3}>
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Расход топлива по транспортным средствам
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={getFuelConsumptionData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Расход топлива (л)" fill="#8884d8" />
                <Bar dataKey="Пробег (км)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Активность водителей
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={getDriverActivityData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Количество рейсов" fill="#8884d8" />
                <Bar dataKey="Общий пробег (км)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Использование транспортных средств
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={getVehicleUsageData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getVehicleUsageData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        )}
      </Box>

      <Box mt={3}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.print()}
        >
          Печать отчета
        </Button>
      </Box>
    </Box>
  );
};

export default ReportPage;