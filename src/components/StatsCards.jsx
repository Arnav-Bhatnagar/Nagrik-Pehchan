import { TrendingUp, TrendingDown, Activity, BarChart3, Zap, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatsCards({ data }) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noData')}
      </div>
    );
  }

  const latestData = data[0];
  
  // Calculate Annual Stress Index as static value: (sum of all stress index) / 10
  const annualStressIndex = data.reduce((sum, d) => sum + (d.stress_index || 0), 0) / 10;
  const annualStressScaled = (annualStressIndex / 100).toFixed(2);
  
  // Scale stress indices to 0-1 range
  const stressIndexScaled = latestData.stress_index ? (latestData.stress_index / 100).toFixed(2) : '0.00';
  
  // Calculate month to month change: (current month stress index - previous month stress index) / 10
  let monthToMonthScore = '0.00';
  let monthToMonthChange = 0;
  if (data.length > 1) {
    const currentStress = latestData.stress_index || 0;
    const previousStress = data[1].stress_index || 0;
    monthToMonthChange = (currentStress - previousStress) / 10;
    monthToMonthScore = monthToMonthChange.toFixed(2);
  } else if (latestData.stress_index) {
    monthToMonthScore = '0.00';
  }

  const stats = [
    {
      title: t('stressIndex'),
      value: stressIndexScaled,
      description: t('stressIndexDesc'),
      icon: Activity,
      color: 'bg-[#FF9933]',
      borderColor: 'border-[#FF9933]',
      change: stressIndexScaled > 0.5 ? 'high' : 'low'
    },
    {
      title: t('annualStress'),
      value: annualStressScaled,
      description: t('annualStressDesc'),
      icon: BarChart3,
      color: 'bg-[#FFB366]',
      borderColor: 'border-[#FF9933]',
      change: annualStressScaled > 0.5 ? 'high' : 'low'
    },
    {
      title: t('monthlyContribution'),
      value: `${latestData.monthly_contribution_score?.toFixed(2) || '0.00'}%`,
      description: t('monthlyContributionDesc'),
      icon: Zap,
      color: 'bg-[#138808]',
      borderColor: 'border-[#138808]',
      change: 'neutral'
    },
    {
      title: t('monthToMonth'),
      value: `${monthToMonthScore}`,
      description: t('monthToMonthDesc'),
      icon: ArrowUpDown,
      color: monthToMonthChange > 0 ? 'bg-[#FF9933]' : 'bg-[#138808]',
      borderColor: monthToMonthChange > 0 ? 'border-[#FF9933]' : 'border-[#138808]',
      change: monthToMonthChange > 0 ? 'increase' : 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.change === 'increase' ? TrendingUp : TrendingDown;

        return (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 ${stat.borderColor} hover:shadow-xl transition-shadow dark:text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {stat.change !== 'neutral' && (
                <TrendIcon className={`w-5 h-5 ${stat.change === 'increase' || stat.change === 'high' ? 'text-[#FF9933]' : 'text-[#138808]'}`} />
              )}
            </div>

            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {stat.title}
            </h3>

            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
