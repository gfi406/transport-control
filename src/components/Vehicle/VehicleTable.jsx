import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Typography, Box
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  
  const isInsuranceExpired = (endDate) => {
    if (!endDate) return false;
    const insuranceEnd = new Date(endDate);
    const today = new Date();
    return insuranceEnd < today;
  };

  if (!vehicles.length) {
    return (
      <Box textAlign="center" p={4}>
        <CarIcon fontSize="large" />
        <Typography variant="h6">Нет данных о транспортных средствах</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Табельный номер</TableCell>
            <TableCell>Марка</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell>Гос. номер</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Топливо</TableCell>
            <TableCell>Страховка</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => {
            const expired = isInsuranceExpired(vehicle.endInsurance);
            
            return (
              <TableRow 
                key={vehicle.id}
                sx={{
                  backgroundColor: expired ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
                  '&:hover': {
                    backgroundColor: expired ? 'rgba(255, 0, 0, 0.2)' : 'action.hover'
                  }
                }}
              >
                <TableCell>{vehicle.personnelNumber || 'Не указан'}</TableCell>
                <TableCell>{vehicle.carName}</TableCell>
                <TableCell>{vehicle.carVin}</TableCell>
                <TableCell>{vehicle.carNumber}</TableCell>
                <TableCell>{vehicle.carCategory}</TableCell>
                <TableCell>
                  {vehicle.carFuelType} ({vehicle.carFuelUsing} л/100км)
                </TableCell>
                <TableCell>
                  {formatDate(vehicle.startInsurance)} - {formatDate(vehicle.endInsurance)}
                  {expired && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: 'error.main',
                        ml: 1,
                        fontWeight: 'bold'
                      }}
                    >
                      (ПРОСРОЧЕНО)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => onEdit(vehicle)}
                    aria-label="Редактировать"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => onDelete(vehicle.id)}
                    aria-label="Удалить"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehicleTable;