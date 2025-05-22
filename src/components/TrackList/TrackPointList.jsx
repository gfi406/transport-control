import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  IconButton, Typography, Box, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import TrackPointForm from './TrackPointForm';
import { formatDateTime } from '../../utils/dateUtils';

const TrackPointList = ({ trackPoints, trackListId, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [currentTrackPoint, setCurrentTrackPoint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEdit = (trackPoint) => {
    setCurrentTrackPoint(trackPoint);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setCurrentTrackPoint(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTrackPoint(null);
    setEditMode(false);
  };

  const handleSubmitSuccess = () => {
    onUpdate();
    handleCloseDialog();
  };

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Точки маршрута</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Добавить точку
        </Button>
      </Box>

      {trackPoints && trackPoints.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Начальная точка</TableCell>
                <TableCell>Конечная точка</TableCell>
                <TableCell>Время начала</TableCell>
                <TableCell>Время окончания</TableCell>
                <TableCell>Расстояние (км)</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>{point.numberPoint}</TableCell>
                  <TableCell>{point.startPointName}</TableCell>
                  <TableCell>{point.endPointName}</TableCell>
                  <TableCell>{formatDateTime(point.startPointTime)}</TableCell>
                  <TableCell>{formatDateTime(point.endPointTime)}</TableCell>
                  <TableCell>{point.distanceTraveled}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(point)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Нет данных о точках маршрута
        </Typography>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Редактировать точку маршрута' : 'Добавить точку маршрута'}
        </DialogTitle>
        <DialogContent>
          <TrackPointForm 
            trackPoint={currentTrackPoint}
            trackListId={trackListId}
            onSubmitSuccess={handleSubmitSuccess}
            editMode={editMode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrackPointList;