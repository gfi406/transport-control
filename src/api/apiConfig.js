export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5190',
  endpoints: {
    trackLists: '/api/TrackList',
    trackPoints: '/api/TrackPoint',
    cars: '/api/Car',
    drivers: '/api/Driver',
    addCar: '/add-car',
    addDriver: '/add-driver',
    closeList: '/Close-list',
    documentation: '/api/TrackList/{id}/documentation'
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};