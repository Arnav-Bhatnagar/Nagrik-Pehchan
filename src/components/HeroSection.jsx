export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] py-12">
      {/* Government Header Bar */}
      <div className="bg-[#0F4C81] border-b-2 border-[#FF9933] py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-lg">🇮🇳 GOVERNMENT OF INDIA</p>
            <p className="text-[#FFD700] text-sm font-semibold">Ministry of Communications</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Main Content Container */}
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Decorative top border with flag colors */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white space-y-4">
              <h2 className="text-4xl font-bold">NAGRIK PEHCHAN</h2>
              <p className="text-[#FFD700] text-xl font-semibold">Aadhaar Enrollment Stress Index</p>
              <p className="text-blue-100 leading-relaxed">
                Monitor real-time stress metrics and enrollment patterns across Indian states. Official Government of India platform for comprehensive Aadhaar enrollment analytics.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-sm text-blue-100">Total States</p>
                  <p className="text-2xl font-bold text-[#FFD700]">29</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-sm text-blue-100">Status</p>
                  <p className="text-2xl font-bold text-[#00FF00]">Live</p>
                </div>
              </div>
            </div>

            {/* Right - Aadhaar Logo */}
            <div className="flex justify-center">
              <div className="relative bg-gradient-to-b from-sky-200 to-sky-50 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1e3a8a] p-12">
                {/* Aadhaar Logo SVG */}
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64">
                  {/* Background circle */}
                  <circle cx="150" cy="150" r="140" fill="white" stroke="#1e3a8a" strokeWidth="3"/>
                  
                  {/* Outer ring with flag colors */}
                  <circle cx="150" cy="150" r="135" fill="none" stroke="#FF9933" strokeWidth="2"/>
                  <circle cx="150" cy="150" r="130" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="150" cy="150" r="125" fill="none" stroke="#138808" strokeWidth="2"/>
                  
                  {/* Aadhaar text - main */}
                  <text x="150" y="80" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#FF9933" fontFamily="Arial, sans-serif">
                    आ
                  </text>
                  
                  {/* English text */}
                  <text x="150" y="130" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#1e3a8a" fontFamily="Arial, sans-serif">
                    AADHAAR
                  </text>
                  
                  {/* Hindi text */}
                  <text x="150" y="170" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#138808" fontFamily="Arial, sans-serif">
                    आधार
                  </text>
                  
                  {/* Tagline */}
                  <text x="150" y="210" textAnchor="middle" fontSize="14" fill="#1e3a8a" fontFamily="Arial, sans-serif">
                    Unique Identification
                  </text>
                  
                  {/* Shield elements */}
                  <path d="M 140 240 L 160 240 L 165 250 L 145 250 Z" fill="#1e3a8a" opacity="0.6"/>
                  <path d="M 145 245 L 155 245 L 157 252 L 143 252 Z" fill="#FF9933" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-8 pt-6 border-t border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-blue-100 text-sm">Data Coverage</p>
                <p className="text-white font-bold">29 States & UTs</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Update Frequency</p>
                <p className="text-white font-bold">Monthly</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Certification</p>
                <p className="text-white font-bold">🔒 Govt Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Government Bar */}
        <div className="mt-6 bg-[#0F4C81] border-t-2 border-[#138808] rounded-lg p-4 text-center">
          <p className="text-blue-100 text-xs">
            © Government of India | Ministry of Communications | Certified Portal
          </p>
        </div>
      </div>
    </div>
  );
}
