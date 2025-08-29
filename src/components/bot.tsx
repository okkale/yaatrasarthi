import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

export default function AIChat({ isOpen, onClose, currentLanguage }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: currentLanguage === 'en' 
        ? '🙏 Namaste! I\'m YatraBuddy, your travel bridge assistant. I solve real problems by connecting your existing apps - IRCTC, Google Maps, payment wallets, hotel bookings - all in one platform. Plus, I\'m loaded with cultural insights about India\'s heritage. Ready to bridge your travel gaps?'
        : '🙏 नमस्ते! मैं यात्राबडी हूँ, आपका यात्रा ब्रिज सहायक। मैं आपके मौजूदा ऐप्स - IRCTC, Google Maps, भुगतान वॉलेट, होटल बुकिंग - सभी को एक प्लेटफॉर्म में जोड़कर वास्तविक समस्याओं का समाधान करता हूँ। साथ ही, मैं भारत की धरोहर के बारे में सांस्कृतिक अंतर्दृष्टि से भरा हूँ। अपनी यात्रा की खाई को पाटने के लिए तैयार हैं?',
      isBot: true,
      timestamp: new Date(),
      suggestions: currentLanguage === 'en' 
        ? ['Connect my IRCTC account', 'Bridge payment apps', 'Show heritage sites in Rajasthan', 'Solve booking problems']
        : ['मेरा IRCTC खाता कनेक्ट करें', 'भुगतान ऐप्स ब्रिज करें', 'राजस्थान में धरोहर स्थल दिखाएं', 'बुकिंग समस्याओं का समाधान करें']
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const culturalDatabase = {
    en: {
      heritage: [
        "The Taj Mahal represents the pinnacle of Mughal architecture, built by Emperor Shah Jahan as a symbol of eternal love. The best time to visit is during sunrise when the marble changes colors beautifully.",
        "Hampi's ruins tell the story of the mighty Vijayanagara Empire. The stone chariot at Vittala Temple is a masterpiece that showcases ancient Indian craftsmanship.",
        "Khajuraho temples demonstrate the architectural brilliance of the Chandela dynasty, with intricate sculptures that celebrate life, love, and spirituality."
      ],
      festivals: [
        "Diwali, the Festival of Lights, symbolizes the victory of light over darkness. Each region celebrates with unique traditions - from rangoli art to traditional sweets.",
        "Holi, the Festival of Colors, celebrates spring's arrival and the triumph of good over evil. Mathura and Vrindavan offer the most authentic celebrations.",
        "Durga Puja in Bengal is not just a festival but a cultural phenomenon, showcasing art, literature, and community bonding at its finest."
      ],
      experiences: [
        "A sunrise boat ride on the Ganges in Varanasi offers a profound spiritual experience, witnessing ancient rituals that have continued for thousands of years.",
        "Exploring Kerala's backwaters on a traditional houseboat provides insight into local life while enjoying the serene natural beauty.",
        "Attending a classical music concert at the Mysore Palace during Dasara festival combines architectural grandeur with India's rich musical heritage."
      ]
    },
    hi: {
      heritage: [
        "ताज महल मुगल स्थापत्य कला का सर्वोच्च नमूना है, जिसे सम्राट शाहजहाँ ने शाश्वत प्रेम के प्रतीक के रूप में बनवाया था। सूर्योदय के समय जाना सबसे अच्छा है जब संगमरमर के रंग खूबसूरती से बदलते हैं।",
        "हम्पी के खंडहर शक्तिशाली विजयनगर साम्राज्य की कहानी कहते हैं। विट्ठल मंदिर का पत्थर का रथ प्राचीन भारतीय शिल्पकला का एक बेजोड़ नमूना है।",
        "खजुराहो के मंदिर चंदेल वंश की स्थापत्य प्रतिभा को दर्शाते हैं, जिनमें जीवन, प्रेम और आध्यात्म का जश्न मनाने वाली जटिल मूर्तियां हैं।"
      ],
      festivals: [
        "दीवाली, रोशनी का त्योहार, अंधकार पर प्रकाश की विजय का प्रतीक है। हर क्षेत्र अपनी अनूठी परंपराओं के साथ मनाता है - रंगोली कला से लेकर पारंपरिक मिठाइयों तक।",
        "होली, रंगों का त्योहार, वसंत के आगमन और बुराई पर अच्छाई की विजय का जश्न मनाता है। मथुरा और वृंदावन सबसे प्रामाणिक उत्सव प्रदान करते हैं।",
        "बंगाल में दुर्गा पूजा सिर्फ एक त्योहार नहीं बल्कि एक सांस्कृतिक घटना है, जो कला, साहित्य और सामुदायिक बंधन को बेहतरीन रूप में प्रदर्शित करती है।"
      ],
      experiences: [
        "वाराणसी में गंगा पर सूर्योदय की नाव यात्रा एक गहरा आध्यात्मिक अनुभव प्रदान करती है, हजारों वर्षों से चली आ रही प्राचीन रीति-रिवाजों को देखते हुए।",
        "पारंपरिक हाउसबोट पर केरल के बैकवाटर की खोज स्थानीय जीवन में अंतर्दृष्टि प्रदान करती है और शांत प्राकृतिक सुंदरता का आनंद लेती है।",
        "दशहरा त्योहार के दौरान मैसूर पैलेस में शास्त्रीय संगीत कार्यक्रम में भाग लेना स्थापत्य भव्यता को भारत की समृद्ध संगीत परंपरा के साथ जोड़ता है।"
      ]
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotResponse = (userInput: string): string => {
    // const input = userInput.toLowerCase();
    // const lang = currentLanguage as 'en' | 'hi';
    
    // // Integration and bridge-related responses
    // if (input.includes('connect') || input.includes('integration') || input.includes('bridge') || input.includes('कनेक्ट') || input.includes('एकीकरण')) {
    //   const responses = currentLanguage === 'en' ? [
    //     'I can help you connect your existing travel apps! Currently, we support IRCTC for trains, Google Maps for navigation, Paytm/PhonePe for payments, and many more. Which app would you like to connect first?',
    //     'Great question about integrations! Our bridge platform connects with 15+ popular apps. You can link your IRCTC account for seamless train booking, sync with Google Maps for smart routing, and use your existing payment apps. Want me to guide you through the setup?',
    //     'Connecting your apps saves 60% of booking time! We securely bridge your existing accounts - IRCTC, MakeMyTrip, OYO, Google Maps, payment wallets. Your data stays with original apps, we just create smart connections.'
    //   ] : [
    //     'मैं आपके मौजूदा यात्रा ऐप्स को कनेक्ट करने में मदद कर सकता हूं! वर्तमान में, हम ट्रेन के लिए IRCTC, नेवीगेशन के लिए Google Maps, भुगतान के लिए Paytm/PhonePe और कई और का समर्थन करते हैं। आप पहले कौन सा ऐप कनेक्ट करना चाहेंगे?',
    //     'एकीकरण के बारे में बेहतरीन सवाल! हमारा ब्रिज प्लेटफॉर्म 15+ लोकप्रिय ऐप्स के साथ जुड़ता है। आप निर्बाध ट्रेन बुकिंग के लिए अपना IRCTC खाता लिंक कर सकते हैं, स्मार्ट रूटिंग के लिए Google Maps के साथ सिंक कर सकते हैं। क्या आप चाहते हैं कि मैं आपको सेटअप के माध्यम से गाइड करूं?',
    //     'अपने ऐप्स को कनेक्ट करना 60% बुकिंग समय बचाता है! हम आपके मौजूदा खातों को सुरक्षित रूप से जोड़ते हैं - IRCTC, MakeMyTrip, OYO, Google Maps, भुगतान वॉलेट। आपका डेटा मूल ऐप्स के साथ रहता है, हम केवल स्मार्ट कनेक्शन बनाते हैं।'
    //   ];
    //   return responses[Math.floor(Math.random() * responses.length)];
    // }

    // // Problem-solving responses
    // if (input.includes('problem') || input.includes('issue') || input.includes('difficulty') || input.includes('समस्या') || input.includes('परेशानी')) {
    //   const responses = currentLanguage === 'en' ? [
    //     'I understand travel planning can be frustrating with multiple apps! That\'s exactly why we built this bridge platform. Instead of juggling IRCTC, hotel apps, maps, and payment apps separately, connect them all here. What specific travel problem are you facing?',
    //     'Travel problems are real! Switching between apps, re-entering details, comparing prices manually - it\'s exhausting. Our platform solves this by creating intelligent bridges between your existing apps. Tell me your biggest travel headache, and I\'ll show you how we fix it.',
    //     'You\'re not alone in facing travel app chaos! Most travelers use 5-8 different apps for one trip. We bridge them all - your IRCTC login works here, Google Maps syncs automatically, payments flow through your existing wallets. What would you like to streamline first?'
    //   ] : [
    //     'मैं समझता हूं कि कई ऐप्स के साथ यात्रा योजना बनाना निराशाजनक हो सकता है! इसीलिए हमने यह ब्रिज प्लेटफॉर्म बनाया है। IRCTC, होटल ऐप्स, मैप्स और भुगतान ऐप्स को अलग-अलग जगल करने के बजाय, उन सभी को यहां कनेक्ट करें। आप किस विशिष्ट यात्रा समस्या का सामना कर रहे हैं?',
    //     'यात्रा की समस्याएं वास्तविक हैं! ऐप्स के बीच स्विच करना, विवरण फिर से दर्ज करना, मैन्युअल रूप से कीमतों की तुलना करना - यह थकाऊ है। हमारा प्लेटफॉर्म आपके मौजूदा ऐप्स के बीच बुद्धिमान ब्रिज बनाकर इसे हल करता है। मुझे अपनी सबसे बड़ी यात्रा परेशानी बताएं, और मैं आपको दिखाऊंगा कि हम इसे कैसे ठीक करते हैं।',
    //     'यात्रा ऐप अराजकता का सामना करने में आप अकेले नहीं हैं! अधिकांश यात्री एक यात्रा के लिए 5-8 अलग-अलग ऐप्स का उपयोग करते हैं। हम उन सभी को जोड़ते हैं - आपका IRCTC लॉगिन यहां काम करता है, Google Maps अपने आप सिंक होता है, भुगतान आपके मौजूदा वॉलेट के माध्यम से होता है। आप पहले क्या सुव्यवस्थित करना चाहेंगे?'
    //   ];
    //   return responses[Math.floor(Math.random() * responses.length)];
    // }

    // if (input.includes('heritage') || input.includes('monument') || input.includes('धरोहर') || input.includes('स्मारक')) {
    //   const responses = culturalDatabase[lang].heritage;
    //   return responses[Math.floor(Math.random() * responses.length)];
    // }
    
    // if (input.includes('festival') || input.includes('celebration') || input.includes('त्योहार') || input.includes('उत्सव')) {
    //   const responses = culturalDatabase[lang].festivals;
    //   return responses[Math.floor(Math.random() * responses.length)];
    // }
    
    // if (input.includes('experience') || input.includes('activity') || input.includes('अनुभव') || input.includes('गतिविधि')) {
    //   const responses = culturalDatabase[lang].experiences;
    //   return responses[Math.floor(Math.random() * responses.length)];
    // }

    // // Default responses
    // const defaultResponses = currentLanguage === 'en' ? [
    //   'I\'m here to help bridge your travel planning gaps! Whether you want to connect your existing apps, solve booking problems, or discover cultural destinations, I can assist. What would you like to explore?',
    //   'Great to chat with you! As your travel bridge assistant, I can help you connect IRCTC, payment apps, maps, and more for seamless journeys. I also know tons about India\'s cultural heritage. What interests you most?',
    //   'Perfect timing! I specialize in solving real travel problems by bridging your existing apps and services. Plus, I\'m loaded with cultural insights about India\'s incredible destinations. How can I help make your travel planning easier?',
    //   'Hello! I\'m designed to be your bridge between scattered travel apps and authentic cultural experiences. Whether it\'s connecting your IRCTC account, finding heritage sites, or solving booking headaches - I\'m here to help!',
    //   'Welcome! Think of me as your travel problem-solver. I bridge the gap between multiple apps, provide cultural insights, and make planning seamless. What travel challenge can I help you tackle today?'
    // ] : [
    //   'मैं आपकी यात्रा योजना की खाई को पाटने में मदद करने के लिए यहां हूं! चाहे आप अपने मौजूदा ऐप्स को कनेक्ट करना चाहते हों, बुकिंग समस्याओं को हल करना चाहते हों, या सांस्कृतिक गंतव्यों की खोज करना चाहते हों, मैं सहायता कर सकता हूं। आप क्या खोजना चाहेंगे?',
    //   'आपसे बात करके खुशी हुई! आपके यात्रा ब्रिज सहायक के रूप में, मैं आपको निर्बाध यात्राओं के लिए IRCTC, भुगतान ऐप्स, मैप्स और अधिक कनेक्ट करने में मदद कर सकता हूं। मैं भारत की सांस्कृतिक धरोहर के बारे में भी बहुत कुछ जानता हूं। आपको सबसे ज्यादा क्या दिलचस्पी है?',
    //   'सही समय! मैं आपके मौजूदा ऐप्स और सेवाओं को जोड़कर वास्तविक यात्रा समस्याओं को हल करने में विशेषज्ञ हूं। साथ ही, मैं भारत के अविश्वसनीय गंतव्यों के बारे में सांस्कृतिक अंतर्दृष्टि से भरा हूं। मैं आपकी यात्रा योजना को आसान बनाने में कैसे मदद कर सकता हूं?',
    //   'नमस्ते! मुझे बिखरे हुए यात्रा ऐप्स और प्रामाणिक सांस्कृतिक अनुभवों के बीच आपके ब्रिज के रूप में सोचें। चाहे वह आपके IRCTC खाते को कनेक्ट करना हो, धरोहर स्थल खोजना हो, या बुकिंग की परेशानियों को हल करना हो - मैं मदद के लिए यहां हूं!',
    //   'स्वागत है! मुझे अपने यात्रा समस्या-समाधानकर्ता के रूप में सोचें। मैं कई ऐप्स के बीच की खाई को पाटता हूं, सांस्कृतिक अंतर्दृष्टि प्रदान करता हूं, और योजना बनाना निर्बाध बनाता हूं। आज मैं आपकी किस यात्रा चुनौती से निपटने में मदद कर सकता हूं?'
    // ];
    
    // return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
     // Development stage response - simple message for all inputs
     return currentLanguage === 'en' 
     ? "I'm in developing stage, I'll be available soon" 
     : "मैं विकास चरण में हूं, जल्द ही उपलब्ध हो जाऊंगा";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        isBot: true,
        timestamp: new Date(),
        suggestions: currentLanguage === 'en' 
          ? ['Tell me more', 'Show booking options', 'Plan my itinerary', 'Local experiences nearby']
          : ['और बताएं', 'बुकिंग विकल्प दिखाएं', 'मेरी यात्रा योजना बनाएं', 'आसपास के स्थानीय अनुभव']
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">YatraBuddy</h3>
            <p className="text-xs opacity-90">
              {currentLanguage === 'en' ? 'AI Cultural Guide' : 'AI सांस्कृतिक गाइड'}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-xs">Online</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}>
                    {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className={`p-3 rounded-lg ${
                      message.isBot 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInput(suggestion)}
                            className="block text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors mb-1"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentLanguage === 'en' ? 'Ask about app connections, travel problems, destinations...' : 'ऐप कनेक्शन, यात्रा समस्याओं, गंतव्यों के बारे में पूछें...'}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}