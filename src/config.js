// Denna konfiguration gör det lättare att växla mellan olika API-servrar (t.ex. utveckling, staging, produktion) genom att ändra värdet på miljövariabeln utan att behöva ändra i själva koden

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
