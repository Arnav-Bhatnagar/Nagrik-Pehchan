import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartsSection({ data }) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return null;
  }

  const reversedData = [...data].reverse().filter(d => {
    const date = new Date(d.month);
    const month = date.getMonth();
    const year = date.getFullYear();
    // Filter out February (month index 1) and January 2026
    return !(month === 1 || (month === 0 && year === 2026));
  });

  // Calculate static Annual Stress Index: (sum of all stress index) / 10
  const annualStressIndex = data.reduce((sum, d) => sum + (d.stress_index || 0), 0) / 10;
  
  const months = reversedData.map(d => {
    const date = new Date(d.month);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: t('stressIndex'),
        data: reversedData.map(d => d.stress_index),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: t('annualStress'),
        data: reversedData.map(() => annualStressIndex),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  };

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: t('monthlyContribution'),
        data: reversedData.map(d => d.monthly_contribution_score),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };

  const changeChartData = {
    labels: months,
    datasets: [
      {
        label: t('monthToMonth'),
        data: reversedData.map((d, index) => {
          if (index === 0) return 0; // First month has no previous month to compare
          const currentStress = d.stress_index;
          const previousStress = reversedData[index - 1].stress_index;
          return ((currentStress - previousStress) / 10);
        }),
        backgroundColor: reversedData.map((d, index) => {
          if (index === 0) return 'rgba(139, 139, 139, 0.7)'; // Gray for first month
          const currentStress = d.stress_index;
          const previousStress = reversedData[index - 1].stress_index;
          const change = (currentStress - previousStress) / 10;
          return change >= 0 ? 'rgba(255, 153, 51, 0.7)' : 'rgba(19, 136, 8, 0.7)';
        }),
        borderColor: reversedData.map((d, index) => {
          if (index === 0) return 'rgb(139, 139, 139)'; // Gray for first month
          const currentStress = d.stress_index;
          const previousStress = reversedData[index - 1].stress_index;
          const change = (currentStress - previousStress) / 10;
          return change >= 0 ? 'rgb(255, 153, 51)' : 'rgb(19, 136, 8)';
        }),
        borderWidth: 2
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          font: { size: 11 },
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-8 bg-red-500 rounded"></div>
          {t('trendAnalysis')}
        </h3>
        <div className="h-80">
          <Line data={lineChartData} options={lineOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-500 rounded"></div>
            {t('contributionBreakdown')}
          </h3>
          <div className="h-80">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-green-500 rounded"></div>
            {t('changeOverTime')}
          </h3>
          <div className="h-80">
            <Bar data={changeChartData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
