import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, IconButton, 
  Typography, Box, Dialog, DialogActions, 
  DialogContent, DialogTitle, Tooltip, Collapse
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add'; 
import { getTrackLists, deleteTrackList, getTrackListById } from '../../api/transportApi';
import { generateDocumentation } from '../../api/transportApi';
import TrackListForm from './TrackListForm';
import CloseTrackListForm from './CloseTrackListForm';
import { formatDateTime } from '../../utils/dateUtils';
import AddPointForm from './TrackPointForm';
import TrackPointList from './TrackPointList';

const TrackListTable = ({ trackLists, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTrackList, setCurrentTrackList] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openPointDialog, setOpenPointDialog] = useState(false);
  const [pointTrackList, setPointTrackList] = useState(null);
  const [closeTrackList, setCloseTrackList] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [trackPoints, setTrackPoints] = useState({});

  const handleRowClick = async (trackListId) => {
    try {
      if (expandedRows[trackListId]) {        
        setExpandedRows(prev => ({ ...prev, [trackListId]: false }));
        return;
      }

      setLoading(true);
      const response = await getTrackListById(trackListId);
      setTrackPoints(prev => ({
        ...prev,
        [trackListId]: response.data.trackPoints || []
      }));
      setExpandedRows(prev => ({ ...prev, [trackListId]: true }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trackList) => {
    setCurrentTrackList(trackList);
    setEditMode(true);
    setOpenFormDialog(true);
  };

  const handleGenerateDocumentation = async (trackList) => {
    setLoading(true);
    setError(null);
    try {
      const templatePath = 'Templates/form.xlsx';
      const outputFolder = 'Documents/TrackLists';

      const response = await generateDocumentation(trackList.id, templatePath, outputFolder);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      let fileName = 'tracklist.pdf';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Документация успешно сгенерирована и загружена!');
    } catch (err) {
      console.error(err);
      setError('Ошибка при генерации документации');
      alert('Ошибка при генерации документации');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoint = (trackList) => {
    setPointTrackList(trackList);
    setOpenPointDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteTrackList(id);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setCurrentTrackList(null);
    setEditMode(false);
  };

  const handleSubmitSuccess = () => {
    onUpdate();
    handleCloseFormDialog();
  };

  const handleCloseTrackList = (trackList) => {
    setCloseTrackList(trackList);
    setOpenCloseDialog(true);
  };

  const handleCloseTrackListSuccess = () => {
    onUpdate();
    setOpenCloseDialog(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Путевые листы</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setEditMode(false);
            setCurrentTrackList(null);
            setOpenFormDialog(true);
          }}
          sx={{ ml: 2 }}
        >
          Создать путевой лист
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Табельный номер</TableCell>
              <TableCell>Автомобиль</TableCell>
              <TableCell>Водитель</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Окончание</TableCell>
              <TableCell>Пробег</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackLists.map((trackList) => (
              <React.Fragment key={trackList.id}>
                <TableRow 
                  hover
                  sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
                  onClick={() => handleRowClick(trackList.id)}
                >
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(trackList.id);
                      }}
                    >
                      {expandedRows[trackList.id] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{trackList.driver?.personnelNumber || 'Не указан'}</TableCell>
                  <TableCell>
                    {trackList.car?.carName || 'Не указан'} ({trackList.car?.carNumber || '-'})
                  </TableCell>
                  <TableCell>
                    {trackList.driver?.driverName || 'Не указан'}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(trackList.startTime)}
                  </TableCell>
                  <TableCell>
                    {trackList.validityPeriodEnd ? formatDateTime(trackList.validityPeriodEnd) : '-'}
                  </TableCell>
                  <TableCell>
                    {trackList.odometrStart != null && trackList.odometrEnd != null
                      ? `${trackList.odometrEnd - trackList.odometrStart} км`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {trackList.odometrEnd ? (
                      <Typography color="success.main">Завершен</Typography>
                    ) : (
                      <Typography color="warning.main">Активен</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      
                      
                      {!trackList.odometrEnd && (
                        <Tooltip title="Добавить точку">
                          <IconButton 
                            color="info" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddPoint(trackList);
                            }}
                            size="small"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {trackList.odometrEnd && (
                        <Tooltip title="Печать">
                          <IconButton 
                            color="info" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateDocumentation(trackList);
                            }}
                            size="small"
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {!trackList.odometrEnd && (
                        <Tooltip title="Закрыть путевой лист">
                          <IconButton 
                            color="warning" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseTrackList(trackList);
                            }}
                            size="small"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Удалить">
                        <IconButton 
                          color="error" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(trackList.id);
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={expandedRows[trackList.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Точки маршрута
                        </Typography>
                        {trackPoints[trackList.id] && trackPoints[trackList.id].length > 0 ? (
                          <Table size="small" aria-label="points">
                            <TableHead>
                              <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Начальная точка</TableCell>
                                <TableCell>Конечная точка</TableCell>
                                <TableCell>Время начала</TableCell>
                                <TableCell>Время окончания</TableCell>
                                <TableCell>Расстояние (км)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {trackPoints[trackList.id].map((point) => (
                                <TableRow key={point.id}>
                                  <TableCell>{point.numberPoint}</TableCell>
                                  <TableCell>{point.startPointName}</TableCell>
                                  <TableCell>{point.endPointName}</TableCell>
                                  <TableCell>{formatDateTime(point.startPointTime)}</TableCell>
                                  <TableCell>{formatDateTime(point.endPointTime)}</TableCell>
                                  <TableCell>{point.distanceTraveled}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Нет данных о точках маршрута
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openFormDialog} 
        onClose={handleCloseFormDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Редактировать путевой лист' : 'Создать путевой лист'}
        </DialogTitle>
        <DialogContent>
          <TrackListForm 
            trackList={currentTrackList}
            onSubmitSuccess={handleSubmitSuccess}
            editMode={editMode}
            onClose={handleCloseFormDialog}
          />
        </DialogContent>
      </Dialog> 
      
      {pointTrackList && (
        <Dialog
          open={openPointDialog}
          onClose={() => setOpenPointDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Добавить точку</DialogTitle>
          <DialogContent>
            <AddPointForm 
              trackListId={pointTrackList.id}
              trackList={pointTrackList} 
              onSuccess={() => {
                setOpenPointDialog(false);
                onUpdate();
              }} 
              onCancel={() => setOpenPointDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      )}      
      
      {closeTrackList && (
        <CloseTrackListForm
          open={openCloseDialog}
          trackListId={closeTrackList.id}
          onClose={() => setOpenCloseDialog(false)}
          onSubmitSuccess={handleCloseTrackListSuccess}
        />
      )}
    </Box>
  );
};

export default TrackListTable;