import React, { useState } from 'react';
import { 
  TextField, 
  Grid, 
  Button, 
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  createTrackPoint, 
  updateTrackPoint 
} from '../../api/transportApi';
import { parseISO } from 'date-fns';

const TrackPointForm = ({ trackPoint, trackListId, onSubmitSuccess, editMode, onCancel }) => {
  const [formData, setFormData] = useState({
    numberPoint: trackPoint?.numberPoint || 1,
    customerCode: trackPoint?.customerCode || '',
    startPointName: trackPoint?.startPointName || '',
    endPointName: trackPoint?.endPointName || '',
    startPointTime: trackPoint?.startPointTime ? parseISO(trackPoint.startPointTime) : new Date(),
    endPointTime: trackPoint?.endPointTime ? parseISO(trackPoint.endPointTime) : new Date(),
    distanceTraveled: trackPoint?.distanceTraveled || 0,
    trackListId: trackListId 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      setError(null);
      
      const trackPointData = {
        ...formData,
        startPointTime: formData.startPointTime.toISOString(),
        endPointTime: formData.endPointTime.toISOString(),
        distanceTraveled: parseInt(formData.distanceTraveled),
        numberPoint: parseInt(formData.numberPoint)
      };

      if (editMode) {
        await updateTrackPoint(trackPoint.id, trackPointData);
      } else {
        await createTrackPoint(trackPointData);
      }

      setSuccess(true);
      
      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess();
        }, 1500); 
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при сохранении точки маршрута');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Номер точки"
              name="numberPoint"
              type="number"
              value={formData.numberPoint}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Код клиента"
              name="customerCode"
              value={formData.customerCode}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Начальная точка"
              name="startPointName"
              value={formData.startPointName}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Конечная точка"
              name="endPointName"
              value={formData.endPointName}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Дата начала"
              value={formData.startPointTime}
              onChange={handleDateChange('startPointTime')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TimePicker
              label="Время начала"
              value={formData.startPointTime}
              onChange={handleDateChange('startPointTime')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Дата окончания"
              value={formData.endPointTime}
              onChange={handleDateChange('endPointTime')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TimePicker
              label="Время окончания"
              value={formData.endPointTime}
              onChange={handleDateChange('endPointTime')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Пройденное расстояние (км)"
              name="distanceTraveled"
              type="number"
              value={formData.distanceTraveled}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? 'Сохранение...' : editMode ? 'Обновить' : 'Создать'}
            </Button>
            
            {onCancel && (
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={onCancel}
                fullWidth
                disabled={loading}
              >
                Отмена
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {editMode ? 'Точка маршрута успешно обновлена!' : 'Точка маршрута успешно создана!'}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default TrackPointForm;