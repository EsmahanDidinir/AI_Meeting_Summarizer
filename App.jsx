import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, FileText, Send, Loader2, Calendar, Search, Clock } from 'lucide-react';
import iconPng from './assets/icon.png'; // MeetingMindAI logonuz

// Google Colab'dan aldığınız güncel Ngrok URL'sini buraya yapıştırın!
const API_BASE_URL = "https://wool-overbill-baked.ngrok-free.dev"; 

function App() {
  const [activeTab, setActiveTab] = useState('ozet'); // 'ozet', 'chat' veya 'gecmis'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Canlı backend'den dönen veriler
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  
  // Chat sekmesi durumları
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // GEÇMİŞ VERİTABANI DURUMLARI
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Veritabanından geçmişi çeken fonksiyon
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) throw new Error('Geçmiş verileri alınamadı.');
      const data = await response.json();
      setHistoryList(data);
    } catch (error) {
      console.error("Geçmiş yükleme hatası:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Sol menüden Geçmiş (Takvim) butonuna basılınca verileri yenile
  const handleOpenHistory = () => {
    setActiveTab('gecmis');
    fetchHistory();
  };

  // Geçmişten eski bir özete tıklandığında ekrana getirme fonksiyonu
  const handleSelectHistoryItem = (item) => {
    setSummary(item.summary);
    setTranscript(item.transcript);
    setActiveTab('ozet'); // Eski özeti görmek için özet sekmesine fırlatır
  };

  // Ses Dosyası Seçimi ve İşleme
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/process-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Ses dosyası işlenirken backend hatası oldu.');

      const data = await response.json();
      setTranscript(data.transcript);
      setSummary(data.summary);
      setActiveTab('ozet');
    } catch (error) {
      console.error(error);
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Soru-Cevap Gönderimi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userQuestion = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat?question=${encodeURIComponent(userQuestion)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Cevap alınamadı.');

      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Bir hata oluştu.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF7F6] font-sans antialiased overflow-hidden">
      
      {/* 1. SOL SIDEBAR (SABİT MENÜ) */}
      <div className="w-24 bg-[#1e293b] border-r border-gray-100 flex flex-col justify-between items-center py-8 shadow-sm z-10">
        <div className="flex flex-col items-center space-y-6 w-full">
          
          {/* CANLI PANEL BUTONU */}
          <button 
            onClick={() => setActiveTab('ozet')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm ${
              activeTab === 'ozet' || activeTab === 'chat'
                ? 'bg-purple-50 border border-purple-100 text-purple-600'
                : 'bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-5 h-5" />
          </button>

          {/* TAKVİM SİMGESİ (ARTI KESİN OLARAK GEÇMİŞ PANELİ) */}
          <button 
            onClick={handleOpenHistory}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm ${
              activeTab === 'gecmis'
                ? 'bg-purple-50 border border-purple-100 text-purple-600'
                : 'bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>

          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-all shadow-sm">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* LOGO */}
        <div className="w-full flex justify-center px-2 select-none">
          <img src={iconPng} alt="MeetingMindAI Logo" className="w-full max-h-12 object-contain" />
        </div>
      </div>

      {/* 2. SAĞ PANEL (ANA İÇERİK ALANI) */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
        
        {/* ÜST SEKMELER (Sadece Canlı İşlem Modundaysa Görünür) */}
        {activeTab !== 'gecmis' && (
          <div className="flex space-x-2 bg-gray-200/60 p-1.5 rounded-xl w-full max-w-md self-start mb-4 z-10">
            <button
              onClick={() => setActiveTab('ozet')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'ozet' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="tracking-wide">METİN ÖZETİ</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'chat' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="tracking-wide">CHAT</span>
            </button>
          </div>
        )}

        {activeTab === 'gecmis' && (
          <div className="text-sm font-bold text-gray-700 mb-4 tracking-wide flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>VERİTABANI VERİ GEÇMİŞİ</span>
          </div>
        )}

        {/* ANA ÇALIŞMA PENCERESİ */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 bg-[#F4EFF0] rounded-2xl border border-gray-200/30 p-6 shadow-inner overflow-y-auto flex flex-col pb-24">
            
            {/* SEKME 1: CANLI METİN ÖZETİ */}
            {activeTab === 'ozet' && (
              <div className="space-y-6 flex-1 relative h-full flex flex-col">
                {loading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 rounded-xl z-50">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
                    <p className="text-gray-700 font-semibold text-sm">Ses dosyası işleniyor...</p>
                  </div>
                )}

                {summary ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 whitespace-pre-wrap text-gray-800 leading-relaxed">
                    <h3 className="text-base font-bold text-gray-900 mb-4 border-b pb-2 flex items-center space-x-2">
                      <span className="w-1.5 h-4 bg-gray-700 rounded-sm"></span>
                      <span>Toplantı Özeti ve Sonuçları</span>
                    </h3>
                    {summary}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400/80 py-24 my-auto">
                    <FileText className="w-16 h-16 stroke-[1.2] mb-3" />
                    <p className="font-medium text-center text-sm">Henüz bir ses yüklenmedi veya geçmişten seçilmedi.</p>
                  </div>
                )}

                {transcript && (
                  <div className="bg-white/50 p-5 rounded-xl border border-gray-200/40 mt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Konuşma Metni</h4>
                    <p className="text-xs text-gray-600 italic">{transcript}</p>
                  </div>
                )}
              </div>
            )}

            {/* SEKME 2: SORU - CEVAP CHAT */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between flex-1">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400/80 py-24 my-auto">
                      <MessageSquare className="w-16 h-16 stroke-[1.2] mb-3" />
                      <p className="font-medium text-center text-sm">Toplantı içeriği hakkında soru sorun.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.sender === 'user' ? 'bg-gray-700 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}>{msg.text}</div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl px-4 py-3 text-sm flex items-center space-x-2 shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-medium">Llama yanıt hazırlıyor...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex space-x-2 mt-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Toplantıya dair bir soru sorun..."
                    className="flex-1 bg-white border border-gray-300/60 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    disabled={chatLoading}
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()} className="bg-gray-700 text-white p-3 rounded-xl">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}

            {/* SEKME 3: VERİTABANI GEÇMİŞ LİSTESİ */}
            {activeTab === 'gecmis' && (
              <div className="space-y-4 flex-1">
                {historyLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-2 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-medium">Veritabanından geçmiş okunuyor...</span>
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="text-center py-24 text-gray-400 text-sm">
                    Veritabanında henüz kayıtlı özet bulunamadı.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {historyList.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleSelectHistoryItem(item)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-purple-300 cursor-pointer transition-all flex justify-between items-center group"
                      >
                        <div className="truncate max-w-[85%]">
                          <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                            {item.summary ? item.summary.slice(0, 80) + '...' : 'Özet İçeriği'}
                          </h4>
                          <span className="text-xs text-gray-400 block mt-1">{item.created_at}</span>
                        </div>
                        <FileText className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* SES YÜKLEME BUTONU */}
          <div className="absolute bottom-4 left-4 z-20">
            <label className={`w-14 h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all shadow-md group ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />}
              <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} disabled={loading} />
            </label>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;