import axios from 'axios';
import { apiConfig } from './apiConfig';

const transportApi = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTrackLists = async () => {
  return await transportApi.get('/api/TrackList');
};

export const getTrackListById = async (id) => {
  return await transportApi.get(`/api/TrackList/${id}`);
};
export const addRoutePoint = async (trackListId, pointData) => {
  const response = await transportApi.post(`/track-lists/${trackListId}/route-points`, pointData);
  return response.data;
};

export const closeTrackList = async (closeData) => {
  return await transportApi.put(`/close-list`, closeData);
};

export const createTrackList = async (trackListData) => {
  return await transportApi.post('/api/TrackList', trackListData);
};

export const updateTrackList = async (id, trackListData) => {
  return await transportApi.put(`/api/TrackList/${id}`, trackListData);
};

export const deleteTrackList = async (id) => {
  return await transportApi.delete(`/api/TrackList/${id}`);
};

export const addCarToTrackList = async (trackListId, carId) => {
  return await transportApi.put('/add-car', { trackListId, carId });
};

export const addDriverToTrackList = async (trackListId, driverId) => {
  return await transportApi.put('/add-driver', { trackListId, driverId });
};

export const generateDocumentation = async (id, templatePath, outputFolder) => {
  return await transportApi.get(`/api/TrackList/${id}/documentation`, {
    params: { templatePath, outputFolder },
    responseType: 'blob', 
  });
};





export const createTrackPoint = async (trackPointData) => {
  return await transportApi.post('/api/TrackPoint', trackPointData);
};

export const updateTrackPoint = async (id, trackPointData) => {
  return await transportApi.put(`/api/TrackPoint/${id}`, trackPointData);
};

export const deleteTrackPoint = async (id) => {
  return await transportApi.delete(`/api/TrackPoint/${id}`);
};


export const getCars = async () => {
  return await transportApi.get('/api/Car');
};

export const getCarById = async (id) => {
  return await transportApi.get(`/api/Car/${id}`);
};

export const createCar = async (carData) => {
  return await transportApi.post('/api/Car', carData);
};

export const updateCar = async (id, carData) => {
  return await transportApi.put(`/api/Car/${id}`, carData);
};

export const deleteCar = async (id) => {
  return await transportApi.delete(`/api/Car/${id}`);
};


export const getDrivers = async () => {
  return await transportApi.get('/api/Driver');
};

export const getDriverById = async (id) => {
  return await transportApi.get(`/api/Driver/${id}`);
};

export const createDriver = async (driverData) => {
  return await transportApi.post('/api/Driver', driverData);
};

export const updateDriver = async (id, driverData) => {
  return await transportApi.put(`/api/Driver/${id}`, driverData);
};

export const deleteDriver = async (id) => {
  return await transportApi.delete(`/api/Driver/${id}`);
};

export default transportApi;