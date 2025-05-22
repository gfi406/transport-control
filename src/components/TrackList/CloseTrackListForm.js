import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { closeTrackList } from '../../api/transportApi';
import { format } from 'date-fns';

const CloseTrackListForm = ({ trackListId, onClose, onSubmitSuccess }) => {
  
  const [formData, setFormData] = useState({
    endTime: new Date(),
    remainingFuelEnd: '',
    odometerReadingEnd: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };
  const handleTimeChange = (time) => {
    if (time) {
      setFormData(prev => {
        
        const newDate = new Date(prev.endTime);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        newDate.setSeconds(time.getSeconds());
        return { ...prev, endTime: newDate };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    if (formData.remainingFuelEnd === '' || formData.odometerReadingEnd === '') {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      
      const closeData = {
      trackListId: trackListId,                             
      odometrValue: parseInt(formData.odometerReadingEnd), 
      fuelRemainder: parseFloat(formData.remainingFuelEnd),
      returnTime: formData.endTime.toISOString()           
      };

      await closeTrackList( closeData);
      onSubmitSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || 'Ошибка при закрытии путевого листа');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Закрытие путевого листа</DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Текущая дата и время: {format(new Date(), 'dd.MM.yyyy HH:mm')}
              </Typography>
            </Box>

            <Box mb={2}>
              <DatePicker
                label="Дата закрытия"
                value={formData.endTime}
                onChange={handleDateChange('endTime')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>

            <Box mb={2}>
              <TimePicker
                label="Время закрытия"
                value={formData.endTime}
                onChange={handleDateChange('endTime')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Конечный остаток топлива (л)"
                name="remainingFuelEnd"
                type="number"
                value={formData.remainingFuelEnd}
                onChange={handleChange}
                required
                inputProps={{ step: "0.1" }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Показания одометра при закрытии (км)"
                name="odometerReadingEnd"
                type="number"
                value={formData.odometerReadingEnd}
                onChange={handleChange}
                required
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Закрытие...' : 'Закрыть путевой лист'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CloseTrackListForm;