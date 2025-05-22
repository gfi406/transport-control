import React, { useState } from 'react';
import { 
  TextField, Grid, Button, FormControl, 
  InputLabel, Select, MenuItem, Divider,
  Box, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const VehicleForm = ({ vehicle, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    personnelNumber: vehicle?.personnelNumber || '', 
    carName: vehicle?.carName || '',
    carVin: vehicle?.carVin || '',
    carNumber: vehicle?.carNumber || '',
    carCategory: vehicle?.carCategory || 'B',
    carFuelType: vehicle?.carFuelType || 'АИ-95',
    carFuelUsing: vehicle?.carFuelUsing || 10,
    carOdometr: vehicle?.carOdometr || 0,
    startInsurance: vehicle?.startInsurance ? new Date(vehicle.startInsurance) : new Date(),
    endInsurance: vehicle?.endInsurance ? new Date(vehicle.endInsurance) : new Date(),
  });

  const fuelTypes = ['АИ-92', 'АИ-95', 'АИ-98', 'ДТ', 'Газ'];
  const categories = ['A', 'B', 'C', 'D', 'E'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startInsurance: formData.startInsurance.toISOString(),
      endInsurance: formData.endInsurance.toISOString(),
      carFuelUsing: parseFloat(formData.carFuelUsing),
      carOdometr: parseInt(formData.carOdometr),
      personnelNumber: formData.personnelNumber 
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
           
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Марка и модель"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="VIN номер"
              name="carVin"
              value={formData.carVin}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Государственный номер"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Категория</InputLabel>
              <Select
                name="carCategory"
                value={formData.carCategory}
                onChange={handleChange}
                label="Категория"
                required
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип топлива</InputLabel>
              <Select
                name="carFuelType"
                value={formData.carFuelType}
                onChange={handleChange}
                label="Тип топлива"
                required
              >
                {fuelTypes.map(fuel => (
                  <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Расход топлива (л/100км)"
              name="carFuelUsing"
              type="number"
              value={formData.carFuelUsing}
              onChange={handleChange}
              inputProps={{ step: "0.1" }}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Текущий пробег (км)"
              name="carOdometr"
              type="number"
              value={formData.carOdometr}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
            <Box mt={2} mb={2}>
              <Typography variant="h6">Страховка</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Начало страховки"
              value={formData.startInsurance}
              onChange={handleDateChange('startInsurance')}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  required 
                  margin="normal"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Окончание страховки"
              value={formData.endInsurance}
              onChange={handleDateChange('endInsurance')}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  required 
                  margin="normal"
                />
              )}
              minDate={formData.startInsurance}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {vehicle ? 'Обновить' : 'Создать'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default VehicleForm;