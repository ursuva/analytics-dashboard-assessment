import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barData = {
  labels: makeRangeData.map(item => item.make),
  datasets: categoryLabels.map((label, index) => ({
    label,
    data: makeRangeData.map(item => item[label]),
    backgroundColor: COLORS[index % COLORS.length]
  }))
};
