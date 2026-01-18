import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsCards from './components/StatsCards';
import StateSelector from './components/StateSelector';
import ChartsSection from './components/ChartsSection';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';
import ChatBot from './components/chatbot';



function App() {
  const [selectedState, setSelectedState] = useState('ALL');
  const [stressData, setStressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStressData();
  }, [selectedState]);

  const fetchStressData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stress_metrics')
        .select('*')
        .eq('state_code', selectedState === 'ALL' ? 'IN' : selectedState)
        .order('month', { ascending: false })
        .limit(12);

      if (error) throw error;
      setStressData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
          <Header />
          <HeroSection />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <StateSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600 dark:text-gray-400">Loading data...</div>
              </div>
            ) : (
              <>
                <StatsCards data={stressData} selectedState={selectedState} />
                <ChartsSection data={stressData} selectedState={selectedState} />
              </>
            )}
          </main>
          <footer className="mt-12 py-6 border-t-2 border-[#FF9933] dark:border-[#FFB366]">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p className="text-sm">Government of India | Nagrik Pehchan</p>
            </div>
          </footer>
        </div>

        <div className="app-container">
        
        <ChatBot />
      </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
