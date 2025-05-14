import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EncadrantStats() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/statistics/by-encadrant');
        const data = await response.json();
        
        setChartData({
          labels: data.map(item => item.encadrant),
          datasets: [
            {
              label: 'Stagiaires',
              data: data.map(item => item.nbStagiaires),
              backgroundColor: 'rgba(255, 140, 0, 0.8)', // Orange
              borderColor: 'rgba(255, 140, 0, 1)',
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false,
              hoverBackgroundColor: 'rgba(255, 140, 0, 1)',
              hoverBorderColor: 'rgba(255, 140, 0, 1)'
            },
            {
              label: 'Apprentis',
              data: data.map(item => item.nbApprentis),
              backgroundColor: 'rgba(0, 123, 255, 0.8)', // Blue
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false,
              hoverBackgroundColor: 'rgba(0, 123, 255, 1)',
              hoverBorderColor: 'rgba(0, 123, 255, 1)'
            }
          ]
        });
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Répartition par encadrant',
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return ` ${label}: ${value}`;
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.raw, 0);
            return [`Total: ${total}`];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          precision: 0,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
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
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          Répartition par encadrant
        </h3>
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
      <div className="chart-header">
      </div>
      <div className="chart-content" style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
