import { Line } from 'react-chartjs-2';
import { PointElement, LineElement } from 'chart.js';

ChartJS.register(PointElement, LineElement);

const lineData = {
  labels: lineChartData.map(d => d.name),
  datasets: [{
    label: 'Electric Range',
    data: lineChartData.map(d => d.range),
    borderColor: '#2980b9',
    backgroundColor: '#3498db33',
    tension: 0.4
  }]
};
