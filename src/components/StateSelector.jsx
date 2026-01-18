import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export default function StateSelector({ selectedState, onStateChange }) {
  const { language, t } = useLanguage();
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('state_name_en');

    if (!error && data) {
      setStates(data);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#138808] dark:border-[#90EE90]">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-[#138808] dark:text-[#90EE90]" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t('selectState')}
        </h2>
      </div>

      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-[#FF9933] dark:border-[#FFB366] rounded-lg focus:ring-2 focus:ring-[#138808] dark:focus:ring-[#90EE90] focus:border-[#138808] dark:focus:border-[#90EE90] outline-none transition-all text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        {states.map((state) => (
          <option key={state.state_code} value={state.state_code}>
            {language === 'hi' ? state.state_name_hi : state.state_name_en}
            {state.state_code === 'IN' ? '' : ` (${state.state_code})`}
          </option>
        ))}
      </select>
    </div>
  );
}
