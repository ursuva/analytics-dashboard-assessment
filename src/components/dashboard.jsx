import React, { useEffect, useState, useRef } from 'react';
import evDataRaw from '../data/ev_data2.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { TailSpin } from 'react-loader-spinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC', '#FF6F61', '#A3CB38', '#12CBC4', '#FDA7DC', '#ED4C67'];

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMake, setSelectedMake] = useState('');
  const [displayCount, setDisplayCount] = useState(20); 

  useEffect(() => {
    setTimeout(() => {
      setFilteredData(evDataRaw);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = evDataRaw.filter(item =>
      (
        (item.Make && item.Make.toLowerCase().includes(lowerSearch)) ||
        (item.Model && item.Model.toLowerCase().includes(lowerSearch))
      ) &&
      (selectedMake ? item.Make === selectedMake : true)
    );
    setFilteredData(filtered);
  }, [search, selectedMake]);

  const filteredSegment = filteredData.slice(0, displayCount);

  const makeCounts = filteredData.reduce((acc, curr) => {
    const make = curr.Make || 'Unknown';
    acc[make] = (acc[make] || 0) + 1;
    return acc;
  }, {});

  const makeData = Object.entries(makeCounts).map(([name, value]) => ({ name, value }));

  const numericRanges = evDataRaw
    .filter(item => !isNaN(parseInt(item['Electric Range'])))
    .map(item => ({
      ...item,
      range: parseInt(item['Electric Range'])
    }));

const pieRef = useRef(null);
const barRef = useRef(null);
const lineRef = useRef(null);
const [searchChart, setSearchChart] = useState('');

const handleSearchRedirect = (e) => {
  if (e.key === 'Enter') {
    const term = searchChart.trim().toLowerCase();
    if (term.includes('bar')) barRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (term.includes('line')) lineRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (term.includes('pie')) pieRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
};


  const highestEV = numericRanges.reduce((max, curr) => (curr.range > max.range ? curr : max), numericRanges[0]);
  const lowestEV = numericRanges.reduce((min, curr) => (curr.range < min.range ? curr : min), numericRanges[0]);
  const avgRange = (numericRanges.reduce((sum, curr) => sum + curr.range, 0) / numericRanges.length).toFixed(2);

  const pieChartData = {
    labels: makeData.map(d => d.name),
    datasets: [{
      data: makeData.map(d => d.value),
      backgroundColor: makeData.map((_, i) => COLORS[i % COLORS.length]),
    }]
  };

  const barChartData = {
    labels: filteredData.map(d => d.Make),
    datasets: [{
      label: 'Electric Range',
      data: filteredData.map(d => parseInt(d['Electric Range']) || 0),
      backgroundColor: '#2980b9'
    }]
  };

  const lineChartData = {
    labels: filteredSegment.map((d, i) => `${d.Make} ${i}`),
    datasets: [{
      label: 'Electric Range',
      data: filteredSegment.map(d => parseInt(d['Electric Range']) || 0),
      fill: false,
      borderColor: '#e67e22',
      tension: 0.2
    }]
  };

  const themeStyles = {
    backgroundColor: darkMode ? '#202123' : '#eaf2f8',
    color: darkMode ? '#fdfdfd' : '#2c3e50',
    transition: 'all 0.3s ease',
    fontFamily: 'Segoe UI, sans-serif'
  };
  
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <TailSpin height="80" width="80" color="#3498db" ariaLabel="loading" />
      </div>
    );
  }

  return (
<div style={{ padding: '2rem', ...themeStyles }}>
  
  <div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  background: '#2c3e50',
  color: '#fff',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
  margin: 0,
  boxSizing: 'border-box',
  height: '70px'  
}}>
  <h1 style={{ margin: 0 }}>🚗 <span style={{ fontWeight: 'bold' }}>EV Dashboard</span></h1>
  <input
    type="text"
    placeholder="Type 'bar', 'line' or 'pie'"
    value={searchChart}
    onChange={(e) => setSearchChart(e.target.value)}
    onKeyDown={handleSearchRedirect}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      outline: 'none',
      fontSize: '1rem'
    }}
  />
</div>


  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '80px' }}>
    <h1>⚡ EV Dashboard</h1>
    <button
  onClick={() => setDarkMode(prev => !prev)}
  style={{
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: darkMode ? '#fff' : '#000',
    color: darkMode ? '#000' : '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  {darkMode ? '◑' : '◐'}
</button>


  </div>


      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by Make or Model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px' }}
        />
        <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="">All Makes</option>
          {[...new Set(evDataRaw.map(d => d.Make))].map((make, i) => (
            <option key={i} value={make}>{make}</option>
          ))}
        </select>
      </div>

 
      <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0' }}>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '1rem', backgroundColor: darkMode ? '#333' : '#fff' }}>
          <h3>🚀 Highest Range</h3>
          <p>Make: <strong>{highestEV.Make}</strong></p>
          <p>Model: <strong>{highestEV.Model}</strong></p>
          <p>Type: <strong>{highestEV['Electric Vehicle Type']}</strong></p>
          <p>Range: <strong>{highestEV['Electric Range']} miles</strong></p>
        </div>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '1rem', backgroundColor: darkMode ? '#333' : '#fff' }}>
          <h3>🐢 Lowest Range</h3>
          <p>Make: <strong>{lowestEV.Make}</strong></p>
          <p>Model: <strong>{lowestEV.Model}</strong></p>
          <p>Type: <strong>{lowestEV['Electric Vehicle Type']}</strong></p>
          <p>Range: <strong>{lowestEV['Electric Range']} miles</strong></p>
        </div>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '1rem', backgroundColor: darkMode ? '#333' : '#fff' }}>
          <h3>📏 Average Range</h3>
          <p><strong>{avgRange} miles</strong></p>
        </div>
      </div>

     
<section ref={pieRef} style={{ marginBottom: '3rem' }}>
  <h2>🥧 Manufacturer Distribution</h2>
  <Pie data={pieChartData} />
</section>


   
<section ref={barRef} style={{ marginBottom: '3rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2>📊 Electric Range Segment (Bar Chart)</h2>
    <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
      {[10, 20, 50, 100, 200].map(val => (
        <option key={val} value={val}>{val} entries</option>
      ))}
    </select>
  </div>
  <div style={{
    backgroundColor: darkMode ? '#ffffff' : '#f5f5f5',
    padding: '1rem',
    borderRadius: '1rem'
  }}>
    <Bar
      data={{
        labels: filteredSegment.map((d, i) => `${d.Make} ${i}`),
        datasets: [{
          label: 'Electric Range',
          data: filteredSegment.map(d => parseInt(d['Electric Range']) || 0),
          backgroundColor: '#9b59b6'
        }]
      }}
      options={{ responsive: true }}
    />
  </div>
</section>



     
      <section ref={lineRef} style={{ marginBottom: '3rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2>📈 Range Progression (Line Chart)</h2>
    <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
      {[10, 20, 50, 100, 200].map(val => (
        <option key={val} value={val}>{val} entries</option>
      ))}
    </select>
  </div>
  <div style={{
    backgroundColor: darkMode ? '#ffffff' : '#f5f5f5',
    padding: '1rem',
    borderRadius: '1rem'
  }}>
    <Line data={lineChartData} options={{ responsive: true }} />
  </div>
</section>

      
    </div>
  );
};

export default Dashboard;
