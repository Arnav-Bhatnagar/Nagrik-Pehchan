import { useState, useEffect, useRef } from 'react'
import './ChatBot.css'
import { supabase } from '../lib/supabase'

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'नमस्ते! 👋 मैं आधार नामांकन तनाव सूचकांक सहायक हूं। आप किसी भी राज्य या भारत के बारे में पूछ सकते हैं। कृपया कहें - "Maharashtra का stress index क्या है?" या "All India का monthly contribution बताएं"।\n\n---\n\nHello! 👋 I\'m the Aadhaar Enrollment Stress Index Assistant. You can ask about any state or India as a whole. Please say - "What is Maharashtra\'s stress index?" or "Tell me the monthly contribution for All India".',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const messagesEndRef = useRef(null)
    const recognitionRef = useRef(null)
    const speechSynthesisRef = useRef(null)

    // States data structure
    const statesData = {
        'IN': 'All India',
        'AP': 'Andhra Pradesh',
        'AR': 'Arunachal Pradesh',
        'AS': 'Assam',
        'BR': 'Bihar',
        'CG': 'Chhattisgarh',
        'GA': 'Goa',
        'GJ': 'Gujarat',
        'HR': 'Haryana',
        'HP': 'Himachal Pradesh',
        'JK': 'Jammu and Kashmir',
        'JH': 'Jharkhand',
        'KA': 'Karnataka',
        'KL': 'Kerala',
        'MP': 'Madhya Pradesh',
        'MH': 'Maharashtra',
        'MN': 'Manipur',
        'ML': 'Meghalaya',
        'MZ': 'Mizoram',
        'NL': 'Nagaland',
        'OD': 'Odisha',
        'PB': 'Punjab',
        'RJ': 'Rajasthan',
        'SK': 'Sikkim',
        'TN': 'Tamil Nadu',
        'TG': 'Telangana',
        'TR': 'Tripura',
        'UP': 'Uttar Pradesh',
        'UK': 'Uttarakhand',
        'WB': 'West Bengal',
        'DN': 'Dadra and Nagar Haveli',
        'DD': 'Daman and Diu',
        'LD': 'Lakshadweep',
        'PY': 'Puducherry',
        'CH': 'Chandigarh',
        'DL': 'Delhi',
        'AN': 'Andaman and Nicobar Islands'
    }

    // State-specific stress reduction measures
    const stressReductionMeasures = {
        'IN': {
            en: [
                '• Strengthen National Identification Authority infrastructure',
                '• Implement coordinated enrollment drives across all states',
                '• Establish pan-India mobile enrollment units network',
                '• Standardize training protocols for all enrollment agents',
                '• Deploy rapid document verification systems nationally',
                '• Launch nationwide awareness campaign via media',
                '• Create national helpline for Aadhaar queries',
                '• Implement data synchronization across all state databases'
            ],
            hi: [
                '• राष्ट्रीय पहचान प्राधिकरण की बुनियादी ढांचे को मजबूत करें',
                '• सभी राज्यों में समन्वित नामांकन ड्राइव लागू करें',
                '• पैन-इंडिया मोबाइल नामांकन इकाइयों का नेटवर्क स्थापित करें',
                '• सभी नामांकन एजेंटों के लिए प्रशिक्षण प्रोटोकॉल मानकीकृत करें',
                '• राष्ट्रीय स्तर पर तेजी से दस्तावेज़ सत्यापन प्रणाली तैनात करें',
                '• मीडिया के माध्यम से राष्ट्रव्यापी जागरूकता अभियान शुरू करें',
                '• आधार क्वेरी के लिए राष्ट्रीय हेल्पलाइन बनाएं',
                '• सभी राज्य डेटाबेस के बीच डेटा सिंक्रोनाइजेशन लागू करें'
            ]
        },
        'DL': {
            en: [
                '• Expand enrollment centers in NCR region peripheral areas',
                '• Address high urban migration challenges in Delhi',
                '• Implement mobile units in unauthorized colonies',
                '• Strengthen coordination with municipal authorities',
                '• Deploy bilingual staff for diverse population',
                '• Establish help desks in major market areas',
                '• Create fast-track enrollment for working professionals',
                '• Improve digital backend systems for faster processing'
            ],
            hi: [
                '• एनसीआर क्षेत्र के परिधीय क्षेत्रों में नामांकन केंद्र विस्तृत करें',
                '• दिल्ली में उच्च शहरी प्रवास चुनौतियों का समाधान करें',
                '• अनधिकृत कॉलोनियों में मोबाइल इकाइयां लागू करें',
                '• नगर निकायों के साथ समन्वय को मजबूत करें',
                '• विविध आबादी के लिए द्विभाषी कर्मचारी तैनात करें',
                '• प्रमुख बाजार क्षेत्रों में सहायता डेस्क स्थापित करें',
                '• कार्यरत पेशेवरों के लिए तेजी से नामांकन बनाएं',
                '• तेजी से प्रसंस्करण के लिए डिजिटल बैकएंड सिस्टम में सुधार करें'
            ]
        },
        'MH': {
            en: [
                '• Strengthen enrollment infrastructure in tier-2 and tier-3 cities',
                '• Address specific challenges in coastal and rural regions',
                '• Enhance training for managing industrial workforce requirements',
                '• Establish sector-specific enrollment programs',
                '• Create efficient processes for handling high volume states',
                '• Deploy dedicated teams in metropolitan areas',
                '• Implement real-time tracking of enrollment progress',
                '• Partner with local NGOs for improved outreach'
            ],
            hi: [
                '• टियर-2 और टियर-3 शहरों में नामांकन बुनियादी ढांचे को मजबूत करें',
                '• तटीय और ग्रामीण क्षेत्रों में विशिष्ट चुनौतियों का समाधान करें',
                '• औद्योगिक कार्यबल आवश्यकताओं को संभालने के लिए प्रशिक्षण बढ़ाएं',
                '• क्षेत्र-विशिष्ट नामांकन कार्यक्रम स्थापित करें',
                '• उच्च मात्रा वाले राज्यों को संभालने के लिए कुशल प्रक्रियाएं बनाएं',
                '• महानगरीय क्षेत्रों में समर्पित टीमें तैनात करें',
                '• नामांकन प्रगति की रीयल-टाइम ट्रैकिंग लागू करें',
                '• बेहतर आउटरीच के लिए स्थानीय एनजीओ के साथ भागीदारी करें'
            ]
        },
        'default': {
            en: [
                '• Establish more Aadhaar enrollment centers in rural and remote areas',
                '• Provide mobile enrollment units to improve accessibility',
                '• Reduce rejection rates through better training of enrollment agents',
                '• Implement faster document verification processes',
                '• Conduct awareness campaigns about the importance of Aadhaar',
                '• Create dedicated help desks for enrollment queries',
                '• Improve data quality standards and validation procedures'
            ],
            hi: [
                '• ग्रामीण और दूरदराज के क्षेत्रों में अधिक आधार नामांकन केंद्र स्थापित करें',
                '• पहुंच में सुधार के लिए मोबाइल नामांकन इकाइयों की व्यवस्था करें',
                '• नामांकन एजेंटों के बेहतर प्रशिक्षण से अस्वीकृति दरें कम करें',
                '• दस्तावेज़ सत्यापन प्रक्रिया तेज़ करें',
                '• आधार के महत्व के बारे में जागरूकता अभियान चलाएं',
                '• नामांकन प्रश्नों के लिए समर्पित सहायता डेस्क बनाएं',
                '• डेटा गुणवत्ता मानकों और सत्यापन प्रक्रियाओं में सुधार करें'
            ]
        }
    }

    // State-specific warnings about consequences if stress is not addressed
    const warningsIfNotFixed = {
        'IN': {
            en: [
                '⚠️ Unequal enrollment across states may exclude millions from government services',
                '⚠️ National digital divide could widen if disparities are not addressed',
                '⚠️ Economic growth may be hampered by inefficient identification system',
                '⚠️ Social security benefits may not reach vulnerable populations efficiently',
                '⚠️ e-Governance initiatives could face implementation challenges nationwide',
                '⚠️ Taxation and financial inclusion efforts could be compromised'
            ],
            hi: [
                '⚠️ राज्यों में असमान नामांकन लाखों को सरकारी सेवाओं से बाहर कर सकता है',
                '⚠️ असमानताओं को दूर न किए जाने से राष्ट्रीय डिजिटल विभाजन बढ़ सकता है',
                '⚠️ अक्षम पहचान प्रणाली आर्थिक वृद्धि को बाधित कर सकती है',
                '⚠️ सामाजिक सुरक्षा लाभ कमजोर आबादी तक कुशलता से नहीं पहुंच सकते',
                '⚠️ ई-गवर्नेंस पहल राष्ट्रव्यापी कार्यान्वयन में चुनौतियों का सामना कर सकते हैं',
                '⚠️ कराधान और वित्तीय समावेश प्रयास समझौता किए जा सकते हैं'
            ]
        },
        'DL': {
            en: [
                '⚠️ Delays in Aadhaar enrollment can block access to essential government services',
                '⚠️ High rejection rates may lead to citizen frustration and service abandonment',
                '⚠️ Migrant workers may face barriers in accessing social security benefits',
                '⚠️ Banking and financial services onboarding could be affected',
                '⚠️ Public distribution system could face operational challenges',
                '⚠️ Healthcare and welfare schemes may have reduced effectiveness'
            ],
            hi: [
                '⚠️ आधार नामांकन में देरी आवश्यक सरकारी सेवाओं तक पहुंच को अवरुद्ध कर सकती है',
                '⚠️ उच्च अस्वीकृति दरें नागरिक निराशा और सेवा त्याग का कारण बन सकती हैं',
                '⚠️ प्रवासी कर्मचारी सामाजिक सुरक्षा लाभों तक पहुंचने में बाधा का सामना कर सकते हैं',
                '⚠️ बैंकिंग और वित्तीय सेवाएं ऑनबोर्डिंग प्रभावित हो सकती है',
                '⚠️ सार्वजनिक वितरण प्रणाली को परिचालन चुनौतियों का सामना करना पड़ सकता है',
                '⚠️ स्वास्थ्य और कल्याण योजनों की प्रभावशीलता में कमी आ सकती है'
            ]
        },
        'MH': {
            en: [
                '⚠️ Industrial workforce disruptions may impact productivity and economic growth',
                '⚠️ Rural population may face barriers in accessing agricultural subsidies',
                '⚠️ Coastal regions may experience difficulties in maritime-related services',
                '⚠️ Financial inclusion initiatives could fail in underserved areas',
                '⚠️ Healthcare enrollment in smaller cities may be compromised',
                '⚠️ Educational support schemes may not reach intended beneficiaries'
            ],
            hi: [
                '⚠️ औद्योगिक कार्यबल में व्यवधान उत्पादकता और आर्थिक वृद्धि को प्रभावित कर सकता है',
                '⚠️ ग्रामीण आबादी कृषि सब्सिडी तक पहुंचने में बाधा का सामना कर सकती है',
                '⚠️ तटीय क्षेत्र समुद्री-संबंधित सेवाओं में कठिनाई का सामना कर सकते हैं',
                '⚠️ वित्तीय समावेश पहल अल्पसेवित क्षेत्रों में विफल हो सकते हैं',
                '⚠️ छोटे शहरों में स्वास्थ्य सेवा नामांकन प्रभावित हो सकता है',
                '⚠️ शैक्षिक सहायता योजनें इच्छित लाभार्थियों तक नहीं पहुंच सकती'
            ]
        },
        'default': {
            en: [
                '⚠️ Low enrollment coverage can lead to excluded populations missing government benefits',
                '⚠️ High pending approvals may cause delays in service delivery and citizen frustration',
                '⚠️ Increased rejection rates can discourage people from completing their enrollment',
                '⚠️ Poor data quality can affect accuracy of government databases and services',
                '⚠️ Insufficient enrollment centers can create geographical disparities',
                '⚠️ Administrative bottlenecks can impact digital infrastructure development'
            ],
            hi: [
                '⚠️ कम नामांकन कवरेज सरकारी लाभों से बाहर रह गई आबादी को छोड़ सकता है',
                '⚠️ लंबित स्वीकृतियां सेवा वितरण में देरी और नागरिक निराशा का कारण बन सकती हैं',
                '⚠️ बढ़ी हुई अस्वीकृति दरें लोगों को अपना नामांकन पूरा करने से हतोत्साहित कर सकती हैं',
                '⚠️ खराब डेटा गुणवत्ता सरकारी डेटाबेस और सेवाओं की सटीकता को प्रभावित कर सकती है',
                '⚠️ अपर्याप्त नामांकन केंद्र भौगोलिक असमानताएं पैदा कर सकते हैं',
                '⚠️ प्रशासनिक अड़चनें डिजिटल बुनियादी ढांचे के विकास को प्रभावित कर सकती हैं'
            ]
        }
    }

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(navigator.onLine)
        window.addEventListener('online', handleOnlineStatus)
        window.addEventListener('offline', handleOnlineStatus)

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'hi-IN' // Hindi language

            recognitionRef.current.onstart = () => {
                setIsListening(true)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInputValue(prev => prev + transcript)
            }

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }
        }


        // Initialize speech synthesis
        speechSynthesisRef.current = window.speechSynthesis

        return () => {
            window.removeEventListener('online', handleOnlineStatus)
            window.removeEventListener('offline', handleOnlineStatus)
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (speechSynthesisRef.current) {
                speechSynthesisRef.current.cancel()
            }

            ///////////////////////////////////////////speech end/////////////////////////////////////////////////////////
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const detectLanguage = (text) => {
        // Simple language detection based on Hindi characters
        const hindiRegex = /[\u0900-\u097F]/
        return hindiRegex.test(text) ? 'hindi' : 'english'
    }

    const findStateInQuery = (query) => {
        const lowerQuery = query.toLowerCase()
        
        // Check for "all india" or "india"
        if (lowerQuery.includes('all india') || (lowerQuery.includes('india') && !lowerQuery.includes('state'))) {
            return 'IN'
        }

        // Check state names
        for (const [code, name] of Object.entries(statesData)) {
            if (lowerQuery.includes(name.toLowerCase())) {
                return code
            }
        }

        return null
    }

    // Fetch stress metrics from Supabase
    const fetchStateStressMetrics = async (stateCode) => {
        try {
            const { data, error } = await supabase
                .from('stress_metrics')
                .select('*')
                .eq('state_code', stateCode)
                .order('month', { ascending: false })
                .limit(12) // Get last 12 months

            if (error) {
                console.error('Error fetching stress metrics:', error)
                return null
            }

            return data && data.length > 0 ? data : null
        } catch (error) {
            console.error('Error in fetchStateStressMetrics:', error)
            return null
        }
    }

    // Get state-specific measures
    const getStateMeasures = (stateCode) => {
        return stressReductionMeasures[stateCode] || stressReductionMeasures.default
    }

    // Get state-specific warnings
    const getStateWarnings = (stateCode) => {
        return warningsIfNotFixed[stateCode] || warningsIfNotFixed.default
    }

    const generateBotResponse = async (userMessage) => {
        setIsTyping(true)

        try {
            const language = detectLanguage(userMessage)
            const stateCode = findStateInQuery(userMessage)
            
            if (!stateCode) {
                setIsTyping(false)
                return language === 'hindi'
                    ? `कृपया कोई राज्य या "All India" का उल्लेख करें।\nउदाहरण: "Maharashtra का stress index क्या है?" या "Delhi का monthly contribution बताएं।"\n\nउपलब्ध राज्य: ${Object.values(statesData).slice(0, 5).join(', ')} आदि।`
                    : `Please mention a state or "All India".\nExample: "What is Maharashtra's stress index?" or "Tell me Delhi's monthly contribution."\n\nAvailable states: ${Object.values(statesData).slice(0, 5).join(', ')} etc.`
            }

            const stateName = statesData[stateCode]

            // Fetch real data from Supabase
            const stressData = await fetchStateStressMetrics(stateCode)
            
            let response = ''
            
            if (language === 'hindi') {
                response = `**${stateName} के लिए आधार नामांकन तनाव मेट्रिक्स:\n\n`
                
                if (stressData && stressData.length > 0) {
                    const currentMonth = stressData[0]
                    const previousMonth = stressData.length > 1 ? stressData[1] : null

                    // Current Stress Index
                    response += `📊 तनाव सूचकांक (Stress Index): ${(currentMonth.stress_index).toFixed(2)}/100\n`
                    
                    // Annual Stress Index
                    response += `📈 वार्षिक तनाव सूचकांक (Annual Stress Index): ${(currentMonth.annual_stress_index).toFixed(2)}/100\n`
                    
                    // Monthly Contribution Score
                    response += `⚡ मासिक योगदान स्कोर (Monthly Contribution): ${(currentMonth.monthly_contribution_score).toFixed(2)}%\n`
                    
                    // Month-to-Month Change
                    if (previousMonth) {
                        const changeValue = (currentMonth.stress_index - previousMonth.stress_index).toFixed(2)
                        const changeDirection = changeValue >= 0 ? '📈 (बढ़ा)' : '📉 (घटा)'
                        response += `📊 महीने-दर-महीने परिवर्तन (Month-to-Month Change): ${changeDirection} ${Math.abs(changeValue)}/100\n`
                    }

                    response += `\n**अतिरिक्त मेट्रिक्स:**\n`
                    response += `• आबंटन दर: ${(currentMonth.enrollment_rate).toFixed(2)}%\n`
                    response += `• अस्वीकृति दर: ${(currentMonth.rejection_rate).toFixed(2)}%\n`
                    response += `• लंबित दर: ${(currentMonth.pending_rate).toFixed(2)}%\n`
                } else {
                    response += `ℹ️ इस राज्य के लिए अभी तक कोई डेटा उपलब्ध नहीं है। कृपया बाद में पूछें।\n`
                }

                // Get state-specific measures
                const measures = getStateMeasures(stateCode)
                response += `\n**तनाव कम करने के उपाय (${stateName}):**\n${measures.hi.join('\n')}\n\n`
                
                // Get state-specific warnings
                const warnings = getStateWarnings(stateCode)
                response += `**⚠️ यदि समस्या का समाधान नहीं हुआ तो परिणाम (${stateName}):**\n${warnings.hi.join('\n')}`
            } else {
                response = `**Aadhaar Enrollment Stress Metrics for ${stateName}:**\n\n`
                
                if (stressData && stressData.length > 0) {
                    const currentMonth = stressData[0]
                    const previousMonth = stressData.length > 1 ? stressData[1] : null

                    // Current Stress Index
                    response += `📊 **Stress Index:** ${(currentMonth.stress_index).toFixed(2)}/100\n`
                    
                    // Annual Stress Index
                    response += `📈 **Annual Stress Index:** ${(currentMonth.annual_stress_index).toFixed(2)}/100\n`
                    
                    // Monthly Contribution Score
                    response += `⚡ **Monthly Contribution Score:** ${(currentMonth.monthly_contribution_score).toFixed(2)}%\n`
                    
                    // Month-to-Month Change
                    if (previousMonth) {
                        const changeValue = (currentMonth.stress_index - previousMonth.stress_index).toFixed(2)
                        const changeDirection = changeValue >= 0 ? '📈 (Increased)' : '📉 (Decreased)'
                        response += `📊 **Month-to-Month Change:** ${changeDirection} ${Math.abs(changeValue)}/100\n`
                    }

                    response += `\n**Additional Metrics:**\n`
                    response += `• Enrollment Rate: ${(currentMonth.enrollment_rate).toFixed(2)}%\n`
                    response += `• Rejection Rate: ${(currentMonth.rejection_rate).toFixed(2)}%\n`
                    response += `• Pending Rate: ${(currentMonth.pending_rate).toFixed(2)}%\n`
                } else {
                    response += `ℹ️ No data available yet for this state. Please try again later.\n`
                }

                // Get state-specific measures
                const measures = getStateMeasures(stateCode)
                response += `\nMeasures to Reduce Stress (${stateName}):\n${measures.en.join('\n')}\n\n`
                
                // Get state-specific warnings
                const warnings = getStateWarnings(stateCode)
                response += `⚠️ If the Issue is Not Fixed - Consequences (${stateName}):\n${warnings.en.join('\n')}`
            }

            setIsTyping(false)
            return response
        } catch (error) {
            console.error('Error generating response:', error)
            setIsTyping(false)
            return language === 'hindi'
                ? 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
                : 'Sorry, an error occurred. Please try again.'
        }
    }

    const speakText = (text, language = 'english') => {
        if (!speechSynthesisRef.current) {
            alert('Text-to-speech is not supported in your browser.')
            return
        }

        speechSynthesisRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US'
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 1.0

        const voices = speechSynthesisRef.current.getVoices()
        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN' || voice.lang.startsWith('hi'))
        const englishVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en'))

        if (language === 'hindi' && hindiVoice) {
            utterance.voice = hindiVoice
        } else if (englishVoice) {
            utterance.voice = englishVoice
        }

        utterance.onstart = () => {
            setIsSpeaking(true)
        }

        utterance.onend = () => {
            setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error)
            setIsSpeaking(false)
        }

        speechSynthesisRef.current.speak(utterance)
    }

    const stopSpeaking = () => {
        if (speechSynthesisRef.current) {
            speechSynthesisRef.current.cancel()
            setIsSpeaking(false)
        }
    }

    const toggleSpeechRecognition = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
        }
    }

    ////////////////////////////////////////////////////


    const handleBotMessageSpeak = (messageContent) => {
        const language = detectLanguage(messageContent)

        // Clean the text for speech (remove markdown, links, etc.)
        const cleanText = messageContent
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link markup, keep text
            .replace(/\n/g, '. ') // Replace newlines with periods
            .replace(/•/g, '') // Remove bullet points

        if (isSpeaking) {
            stopSpeaking()
        } else {
            speakText(cleanText, language)
        }
    }



    //////////////////////////////////////////////////

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage = {
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')

        const botResponse = await generateBotResponse(inputValue)

        const botMessage = {
            type: 'bot',
            content: botResponse,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, botMessage])
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatMessage = (content) => {
        return content.split('\n').map((line, index) => {
            if (line.startsWith('') && line.endsWith('')) {
                return <div key={index} className="message-heading">{line.replace(/\*\*/g, '')}</div>
            }
            if (line.startsWith('• ')) {
                return <div key={index} className="message-bullet">{line}</div>
            }
            if (line.includes('[') && line.includes('](')) {
                const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/)
                if (linkMatch) {
                    return (
                        <div key={index}>
                            <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="message-link">
                                {linkMatch[1]}
                            </a>
                        </div>
                    )
                }
            }
            return line ? <div key={index}>{line}</div> : <br key={index} />
        })
    }

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-content">
                            <div className="bot-avatar">🪪</div>
                            <div className="header-text">
                                <h3>Aadhaar Stress Assistant</h3>
                                <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <button
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                <div className="message-content">
                                    {formatMessage(message.content, index)}









                                    {message.type === 'bot' && (
                                        <button
                                            className={`speaker-btn ${isSpeaking ? 'speaking' : ''}`}
                                            onClick={() => handleBotMessageSpeak(message.content)}
                                            title={isSpeaking ? "Stop playback" : "Listen to this message"}
                                        >
                                            {isSpeaking ? '⏹️' : '🔊'}
                                        </button>
                                    )}









                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot typing">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <div className="input-container">
                            <textarea
                                className='message-input'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about any state or All India stress metrics..."
                                rows="1"
                            />
                            <button
                                onClick={toggleSpeechRecognition}
                                className={`mic-btn ${isListening ? 'listening' : ''}`}
                                type="button"
                                title="Speak your query"
                            >
                                🎤
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="send-btn"
                            >
                                ➤
                            </button>
                        </div>
                        <div className="disclaimer">
                            ℹ️ Ask about stress metrics, reduction measures, and potential impacts on Aadhaar services.
                        </div>
                    </div>
                </div>
            )}

            <button
                className={`chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Aadhaar Stress Assistant"
            >
                {isOpen ? '✕' : '🪪'}
            </button>
        </div>
    )
}

export default ChatBot;