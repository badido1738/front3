import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Register Line Chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const orangePalette = {
  stagiaire: '#FF8C00', // Dark orange
  apprenti: '#007BFF',  // Blue (updated to blue)
  hover: '#FF7043',     // Coral orange
  border: '#E67E22'     // Earthy orange
};

export default function MonthlyTraineesLineChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/statistics/monthly-trainees');
        const apiData = response.data;

        setChartData({
          labels: apiData.map(item => `${item.month}/${item.year}`),
          datasets: [
            {
              label: 'Stagiaires',
              data: apiData.map(item => item.stagiaireCount),
              borderColor: orangePalette.stagiaire,
              backgroundColor: 'rgba(255, 140, 0, 0.1)',
              borderWidth: 3,
              tension: 0.3,
              pointBackgroundColor: orangePalette.stagiaire,
              pointRadius: 5,
              pointHoverRadius: 7
            },
            {
              label: 'Apprentis',
              data: apiData.map(item => item.apprentiCount),
              borderColor: orangePalette.apprenti, // Blue color
              backgroundColor: 'rgba(0, 123, 255, 0.1)', // Light blue background
              borderWidth: 3,
              tension: 0.3,
              pointBackgroundColor: orangePalette.apprenti, // Blue color
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        });
      } catch (err) {
        setError(err.message);
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
          boxWidth: 12,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          bottom: 24
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
            const stagiaires = tooltipItems[0].raw;
            const apprentis = tooltipItems[1].raw;
            const total = stagiaires + apprentis;
            return [
              '',
              `Total: ${total}`,
              `Ratio: ${Math.round((apprentis / total) * 100)}% apprentis`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
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
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18v4H3V4z" />
          </svg>
          Évolution mensuelle
        </h3>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18v4H3V4z" />
          </svg>
          Évolution mensuelle
        </h3>
        <p>Erreur lors du chargement</p>
      </div>
      <div className="chart-error">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="chart-card">
      <div className="chart-header">
        <p>Répartition par mois</p>
      </div>
      <div className="chart-content">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
