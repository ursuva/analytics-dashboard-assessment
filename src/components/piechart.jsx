import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, Legend);


const pieData = {
  labels: makeData.map(entry => entry.name),
  datasets: [{
    label: 'Vehicle Count',
    data: makeData.map(entry => entry.value),
    backgroundColor: COLORS,
    borderWidth: 1
  }]
};
