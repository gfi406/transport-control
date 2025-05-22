import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle,
  CircularProgress, Alert
} from '@mui/material';
import VehicleTable from '../components/Vehicle/VehicleTable';
import VehicleForm from '../components/Vehicle/VehicleForm';
import { getCars, createCar, updateCar, deleteCar } from '../api/transportApi';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await getCars();
      setVehicles(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentVehicle(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (vehicleData) => {
    try {
      setLoading(true);
      if (editMode) {
        await updateCar(currentVehicle.id, vehicleData);
      } else {
        await createCar(vehicleData);
      }
      fetchVehicles();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !vehicles.length) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Управление транспортными средствами</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreate}
        >
          Добавить транспорт
        </Button>
      </Box>

      <VehicleTable 
        vehicles={vehicles} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Редактировать транспорт' : 'Добавить транспорт'}
        </DialogTitle>
        <DialogContent>
          <VehicleForm 
            vehicle={currentVehicle} 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiclesPage;