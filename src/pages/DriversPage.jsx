import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle,
  CircularProgress, Alert
} from '@mui/material';
import DriverTable from '../components/Driver/DriverTable';
import DriverForm from '../components/Driver/DriverForm';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../api/transportApi';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await getDrivers();
      setDrivers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentDriver(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEdit = (driver) => {
    setCurrentDriver(driver);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      fetchDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (driverData) => {
    try {
      setLoading(true);
      if (editMode) {
        await updateDriver(currentDriver.id, driverData);
      } else {
        await createDriver(driverData);
      }
      fetchDrivers();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !drivers.length) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Управление водителями</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreate}
        >
          Добавить водителя
        </Button>
      </Box>

      <DriverTable 
        drivers={drivers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Редактировать водителя' : 'Добавить водителя'}
        </DialogTitle>
        <DialogContent>
          <DriverForm 
            driver={currentDriver} 
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

export default DriversPage;