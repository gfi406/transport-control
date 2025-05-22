import React, { useState, useEffect } from 'react';
import { 
  TextField, Grid, Button, FormControl, 
  InputLabel, Select, MenuItem, Typography, 
  Box, Divider 
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  getCars, 
  getDrivers, 
  createTrackList, 
  updateTrackList,
  addCarToTrackList,
  addDriverToTrackList
} from '../../api/transportApi';
import { format, parseISO } from 'date-fns';

const TrackListForm = ({ trackList, onSubmitSuccess, editMode }) => {
  const [formData, setFormData] = useState({
    remainingFuelStart: trackList?.remainingFuelStart || 0,
    startTime: trackList?.startTime ? parseISO(trackList.startTime) : new Date(),
    validityPeriodStart: trackList?.validityPeriodStart ? parseISO(trackList.validityPeriodStart) : new Date(),
    validityPeriodEnd: trackList?.validityPeriodEnd ? parseISO(trackList.validityPeriodEnd) : new Date(),
    selectedCar: trackList?.car?.id || '',
    selectedDriver: trackList?.driver?.id || ''
  });

  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const carsResponse = await getCars();
        const driversResponse = await getDrivers();
        setCars(carsResponse.data);
        setDrivers(driversResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const trackListData = {
        personnelNumber: formData.personnelNumber,
        remainingFuelStart: parseFloat(formData.remainingFuelStart),
        startTime: formData.startTime.toISOString(),
        validityPeriodStart: formData.validityPeriodStart.toISOString(),
        validityPeriodEnd: formData.validityPeriodEnd.toISOString()
      };

      let result;
      if (editMode) {
        result = await updateTrackList(trackList.id, trackListData);
      } else {
        result = await createTrackList(trackListData);
      }

      
      if (formData.selectedCar) {
        await addCarToTrackList(result.data.id, formData.selectedCar);
      }

      
      if (formData.selectedDriver) {
        await addDriverToTrackList(result.data.id, formData.selectedDriver);
      }

      onSubmitSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Начальный остаток топлива (л)"
              name="remainingFuelStart"
              type="number"
              value={formData.remainingFuelStart}
              onChange={handleChange}
              required
              margin="normal"
              sx={{ 
                mb: 2, 
                '& .MuiInputLabel-root': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '90%'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Дата начала"
              value={formData.startTime}
              onChange={handleDateChange('startTime')}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={{ width: '100%' }}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  margin: 'normal'
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Начало периода действия"
              value={formData.validityPeriodStart}
              onChange={handleDateChange('validityPeriodStart')}
              sx={{ width: '100%' }}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  margin: 'normal'
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Окончание периода действия"
              value={formData.validityPeriodEnd}
              onChange={handleDateChange('validityPeriodEnd')}
              sx={{ width: '100%' }}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  margin: 'normal'
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Box mt={2} mb={2}>
              <Typography variant="h6">Прикрепить транспорт и водителя</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Автомобиль</InputLabel>
              <Select
                value={formData.selectedCar}
                onChange={handleChange}
                name="selectedCar"
                label="Автомобиль"
              >
                <MenuItem value="">
                  <em>Не выбран</em>
                </MenuItem>
                {cars.map((car) => (
                  <MenuItem key={car.id} value={car.id}>
                    {car.carName} ({car.carNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Водитель</InputLabel>
              <Select
                value={formData.selectedDriver}
                onChange={handleChange}
                name="selectedDriver"
                label="Водитель"
              >
                <MenuItem value="">
                  <em>Не выбран</em>
                </MenuItem>
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.driverName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {editMode ? 'Обновить' : 'Создать'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};
export default TrackListForm;