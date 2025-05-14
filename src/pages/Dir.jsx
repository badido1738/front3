import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

// Updated color palette with distinct colors for the first three entries
const orangePalette = [
  '#FF8C00', '#1E90FF', '#FF6347',  // First three distinct colors
  '#FFD166', '#E67E22', '#FF7043',
  '#FF9F40', '#FFB74D', '#D35400',
  '#FF5722'
];

export default function DirectionStats() {
  const [chartData, setChartData] = useState({ 
    labels: [], 
    datasets: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/statistics/by-direction');
        const data = await response.json();
        
        const totalTrainees = data.reduce((sum, item) => sum + item.nbStagiaires + item.nbApprentis, 0);
        
        setChartData({
          labels: data.map(item => item.direction),
          datasets: [{
            label: 'Répartition par direction',
            data: data.map(item => item.nbStagiaires + item.nbApprentis),
            backgroundColor: orangePalette,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 10,
            hoverBorderColor: '#1F2937'
          }],
          _totals: data.map(item => ({
            stagiaires: item.nbStagiaires,
            apprentis: item.nbApprentis,
            total: item.nbStagiaires + item.nbApprentis
          }))
        });
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Makes it a donut chart (modern look)
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#374151',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8
        }
      },
      title: {
        display: true,
        text: 'Répartition par direction',
        color: '#111827',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '600'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#E5E7EB',
        borderColor: '#4B5563',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return ` ${label}: ${percentage}% (${value})`;
          },
          afterLabel: (context) => {
            const index = context.dataIndex;
            const item = chartData._totals?.[index];
            return item ? `\nStagiaires: ${item.stagiaires}\nApprentis: ${item.apprentis}` : '';
          }
        }
      }
    }
  };

  if (loading) return (
    <div className="chart-card">
      <div className="chart-header">
        <p>Chargement des données...</p>
      </div>
      <div className="chart-loading">
        <div className="spinner"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="chart-card">
      <div className="chart-header">
        <p>Erreur lors du chargement</p>
      </div>
      <div className="chart-error">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="chart-card">
      <div className="chart-content" style={{ height: '400px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
