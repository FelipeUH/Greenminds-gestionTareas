import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los elementos necesarios de chartjs
ChartJS.register(ArcElement, Tooltip, Legend);