import axios from 'axios';

// Instance Axios unique pour TheMealDB
export const mealApi = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
  timeout: 10000,
});
