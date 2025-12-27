/**
 * API Configuration
 * Centralized API configuration for frontend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_NAME = process.env.REACT_APP_BACKEND || 'express-mongodb';

// Backend base URL (for images) - Extract from API URL
const BACKEND_URL = API_BASE_URL.replace('/api', '');

// Backend configurations
const BACKEND_CONFIGS = {
  'express-mongodb': {
    name: 'Express + MongoDB (2024)',
    port: 5000,
    url: 'http://localhost:5000/api',
    era: 'Modern'
  },
  'express-mongodb-3yr': {
    name: 'Express + MongoDB (2021)',
    port: 5006,
    url: 'http://localhost:5006/api',
    era: '3 Years Old'
  },
  'express-mongodb-6yr': {
    name: 'Express + MongoDB (2018)',
    port: 5007,
    url: 'http://localhost:5007/api',
    era: '6 Years Old (Legacy)'
  },
  'express-mysql': {
    name: 'Express + MySQL',
    port: 5001,
    url: 'http://localhost:5001/api'
  },
  'nestjs-mongodb': {
    name: 'NestJS + MongoDB (2024)',
    port: 5002,
    url: 'http://localhost:5002/api',
    era: 'Modern'
  },
  'nestjs-mongodb-3yr': {
    name: 'NestJS + MongoDB (2021)',
    port: 5008,
    url: 'http://localhost:5008/api',
    era: '3 Years Old'
  },
  'nestjs-mongodb-6yr': {
    name: 'NestJS + MongoDB (2018)',
    port: 5009,
    url: 'http://localhost:5009/api',
    era: '6 Years Old (Legacy)'
  },
  'nestjs-mysql': {
    name: 'NestJS + MySQL (2024)',
    port: 5003,
    url: 'http://localhost:5003/api',
    era: 'Modern'
  },
  'nestjs-mysql-3yr': {
    name: 'NestJS + MySQL (2021)',
    port: 5010,
    url: 'http://localhost:5010/api',
    era: '3 Years Old'
  },
  'nestjs-mysql-6yr': {
    name: 'NestJS + MySQL (2018)',
    port: 5011,
    url: 'http://localhost:5011/api',
    era: '6 Years Old (Legacy)'
  },
  'laravel-mongodb': {
    name: 'Laravel + MongoDB (2024)',
    port: 5004,
    url: 'http://localhost:5004/api',
    era: 'Modern'
  },
  'laravel-mongodb-3yr': {
    name: 'Laravel + MongoDB (2021)',
    port: 5012,
    url: 'http://localhost:5012/api',
    era: '3 Years Old'
  },
  'laravel-mongodb-6yr': {
    name: 'Laravel + MongoDB (2018)',
    port: 5013,
    url: 'http://localhost:5013/api',
    era: '6 Years Old (Legacy)'
  },
  'laravel-mysql': {
    name: 'Laravel + MySQL (2024)',
    port: 5005,
    url: 'http://localhost:5005/api',
    era: 'Modern'
  },
  'laravel-mysql-3yr': {
    name: 'Laravel + MySQL (2021)',
    port: 5014,
    url: 'http://localhost:5014/api',
    era: '3 Years Old'
  },
  'laravel-mysql-6yr': {
    name: 'Laravel + MySQL (2018)',
    port: 5015,
    url: 'http://localhost:5015/api',
    era: '6 Years Old (Legacy)'
  }
};

export {
  API_BASE_URL,
  BACKEND_URL,
  BACKEND_NAME,
  BACKEND_CONFIGS
};

