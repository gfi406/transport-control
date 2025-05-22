import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton,
  Typography, Box
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const DriverTable = ({ drivers, onEdit, onDelete }) => {
  if (!drivers.length) {
    return (
      <Box textAlign="center" p={4}>
        <PersonIcon fontSize="large" />
        <Typography variant="h6">Нет данных о водителях</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ФИО</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Табельный номер</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.driverName}</TableCell>
              <TableCell>{driver.driverCategory}</TableCell>
              <TableCell>{driver.personnelNumber}</TableCell>
              <TableCell>
                <IconButton 
                  color="primary" 
                  onClick={() => onEdit(driver)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => onDelete(driver.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DriverTable;