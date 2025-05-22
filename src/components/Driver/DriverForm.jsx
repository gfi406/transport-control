import React, { useState } from 'react';
import { 
  TextField, Grid, Button, FormControl, 
  InputLabel, Select, MenuItem
} from '@mui/material';

const DriverForm = ({ driver, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    driverName: driver?.driverName || '',
    driverCategory: driver?.driverCategory || 'B',
  });

  const categories = ['A', 'B', 'C', 'D', 'E'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="ФИО водителя"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Категория прав</InputLabel>
            <Select
              name="driverCategory"
              value={formData.driverCategory}
              onChange={handleChange}
              label="Категория прав"
              required
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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
            fullWidth
            size="large"
          >
            {driver ? 'Обновить' : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DriverForm;