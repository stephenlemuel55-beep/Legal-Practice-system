import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { View, ChatMessage, LegalDoc, CourtInfo, BlogPost } from './types';
import { 
  conductDeepResearch, 
  analyzeDocument, 
  predictCaseOutcome, 
  draftLegalDocument, 
  sendChatMessage,
  quickLegalLookup,
  generateSpeech,
  getLegalNews,
  writeBlogArticle
} from './services/geminiService';
import { 
  Loader2, 
  Send, 
  Upload, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2, 
  Search, 
  File, 
  User, 
  Share2,
  FileText,
  BrainCircuit,
  MessageSquare,
  PenTool, 
  Trash2,
  Lock,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Menu,
  Copy,
  Save,
  Download
} from 'lucide-react';

// -- Components Helper --

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-nigeria-dark mb-2">{title}</h2>
    <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
  </div>
);

const ResultCard = ({ title, content, onSpeak }: { title: string, content: string, onSpeak?: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSpeak = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    if (!onSpeak) return;

    try {
      setIsPlaying(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      }
      onSpeak(); 
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {onSpeak && (
          <button 
            onClick={handleSpeak}
            className="flex items-center gap-2 text-sm text-nigeria-green hover:text-nigeria-dark font-medium transition-colors"
          >
            <PlayCircle size={18} />
            Read Aloud
          </button>
        )}
      </div>
      <div className="p-6 prose max-w-none text-gray-700 whitespace-pre-wrap font-sans leading-relaxed text-sm md:text-base">
        {content}
      </div>
    </div>
  );
};

// -- View Components --

const Dashboard = ({ onViewChange }: { onViewChange: (v: View) => void }) => (
  <div className="space-y-6">
    <SectionHeader title="Welcome back, Barrister" subtitle="Here is your practice overview for today." />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div onClick={() => onViewChange(View.RESEARCH)} className="bg-gradient-to-br from-nigeria-green to-emerald-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
        <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Search className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">Start New Research</h3>
        <p className="text-emerald-100 text-sm">Conduct deep legal research on Nigerian Case Law with AI.</p>
      </div>
      
      <div onClick={() => onViewChange(View.DRAFTING)} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:border-nigeria-green transition-colors group">
        <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200">
          <File className="text-orange-600" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Draft Document</h3>
        <p className="text-gray-500 text-sm">Create contracts and agreements based on Nigerian drafting standards.</p>
      </div>

      <div onClick={() => onViewChange(View.PREDICTION)} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:border-nigeria-green transition-colors group">
        <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200">
          <CheckCircle2 className="text-purple-600" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Predict Outcome</h3>
        <p className="text-gray-500 text-sm">Analyze probabilities based on presiding judge behavior.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Recent Activities</h3>
        <ul className="space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-nigeria-green shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800 text-sm md:text-base">Drafted Tenancy Agreement</p>
                <p className="text-xs text-gray-500">2 hours ago • Client: Mr. Okeke</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Upcoming Court Dates</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="font-bold text-gray-800 text-sm md:text-base">Suit No: FHC/L/CS/123/23</p>
              <p className="text-xs text-gray-500">Federal High Court, Lagos</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full shrink-0 ml-2">Tomorrow</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ResearchView = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResult('');
    const res = await conductDeepResearch(query);
    setResult(res);
    setLoading(false);
  };

  const playAudio = async () => {
    if(!result) return;
    const buffer = await generateSpeech(result.substring(0, 400)); 
    if (buffer) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const source = ctx.createBufferSource();
      ctx.decodeAudioData(buffer, (decoded) => {
        source.buffer = decoded;
        source.connect(ctx.destination);
        source.start(0);
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Deep Legal Research" subtitle="Powered by Gemini 3 Pro with Thinking Mode" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green focus:border-transparent outline-none min-h-[120px]"
          placeholder="Enter your legal query here. E.g., 'Can a landlord forcefully evict a tenant in Lagos without a court order if rent is overdue by 6 months?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-nigeria-green hover:bg-nigeria-dark text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 transition-colors w-full md:w-auto justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Conduct Research
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-12 text-center">
          <Loader2 className="animate-spin mx-auto text-nigeria-green mb-4" size={40} />
          <p className="text-gray-500 animate-pulse">Thinking deeply about Nigerian Case Law...</p>
        </div>
      )}

      {result && (
        <ResultCard 
          title="Research Findings" 
          content={result} 
          onSpeak={playAudio}
        />
      )}
    </div>
  );
};

const DraftingView = () => {
  const [docType, setDocType] = useState('');
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDraft = async () => {
    if (!docType || !details) return;
    setLoading(true);
    setSaved(false);
    const res = await draftLegalDocument(docType, details);
    setDraft(res);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend/context
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    if (file.type === 'text/plain') {
      try {
        const text = await file.text();
        setDetails(prev => prev ? prev + '\n\n' + text : text);
      } catch (err) {
        console.error("Failed to read file", err);
      }
    } else {
      alert("Only .txt files are currently supported for direct text import. Please copy paste content for other formats.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Smart Legal Drafting" subtitle="Generate contracts and agreements with legal backing." />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Document Type</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green outline-none"
              placeholder="e.g., Tenancy Agreement"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            />
          </div>

          <div className="mb-4">
             <label className="block font-semibold text-gray-700 mb-2">Key Details & Clauses</label>
             
             {/* Drag and Drop Zone */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               className={`mb-3 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                 isDragging ? 'border-nigeria-green bg-green-50' : 'border-gray-300 hover:border-nigeria-green hover:bg-gray-50'
               }`}
             >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileSelect} 
                 className="hidden" 
                 accept=".txt" 
               />
               <div className="flex flex-col items-center gap-1 text-gray-500">
                  <Upload size={20} />
                  <p className="text-xs md:text-sm">Drag & drop a .txt file to import details</p>
               </div>
             </div>

             <textarea
               className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-nigeria-green outline-none resize-none text-sm"
               placeholder="Enter parties involved, terms, rent amount, duration, etc."
               value={details}
               onChange={(e) => setDetails(e.target.value)}
             />
          </div>
          <button 
            onClick={handleDraft}
            disabled={loading}
            className="bg-nigeria-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors flex items-center gap-2 w-full justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PenTool size={20}/>}
            Generate Document
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Draft Preview</h3>
            <div className="flex gap-2">
               {draft && (
                 <>
                   <button 
                     onClick={handleCopy}
                     className="p-2 text-gray-500 hover:text-nigeria-green hover:bg-green-50 rounded transition-all" 
                     title="Copy to Clipboard"
                   >
                     {copied ? <CheckCircle2 size={18} className="text-green-600"/> : <Copy size={18}/>}
                   </button>
                   <button 
                     onClick={handleSave}
                     className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" 
                     title="Save to Vault"
                   >
                     {saved ? <CheckCircle2 size={18} className="text-blue-600"/> : <Save size={18}/>}
                   </button>
                 </>
               )}
            </div>
          </div>
          
          {draft ? (
            <textarea 
              className="flex-1 w-full p-2 outline-none resize-none font-mono text-sm text-gray-700 leading-relaxed"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <FileText size={48} className="mb-4 opacity-20"/>
               <p className="text-sm">Generated document will appear here.</p>
               <p className="text-xs opacity-60">You can edit the result directly.</p>
            </div>
          )}
          
          {saved && (
             <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-xs rounded text-center animate-pulse">
               Document saved to Cloud Vault
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisView = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  // Chat state for document
  const [docChatMessages, setDocChatMessages] = useState<ChatMessage[]>([]);
  const [docChatInput, setDocChatInput] = useState('');
  const [docChatLoading, setDocChatLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        // Reset chat when new file loaded
        setDocChatMessages([]);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setDocChatMessages([]); // Reset chat on new analysis
    
    let base64Data = undefined;
    let mimeType = undefined;

    if (image) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    const res = await analyzeDocument(text, base64Data, mimeType);
    setAnalysis(res);
    setLoading(false);
  };

  const handleDocChatSend = async () => {
    if (!docChatInput.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: docChatInput, timestamp: new Date() };
    setDocChatMessages(prev => [...prev, userMsg]);
    setDocChatInput('');
    setDocChatLoading(true);

    try {
      // Construct history with the document context
      const history: { role: string; parts: any[] }[] = [];
      
      // Add the document context as the first user message
      const contextParts: any[] = [];
      
      if (image) {
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
           contextParts.push({
             inlineData: { mimeType: matches[1], data: matches[2] }
           });
        }
      }
      
      if (text) {
        contextParts.push({ text: `Document Content:\n${text}` });
      }
      
      if (contextParts.length === 0) {
        contextParts.push({ text: "No document provided, just general legal questions." });
      } else {
        contextParts.push({ text: "Analyze the above document context." });
      }

      history.push({ role: 'user', parts: contextParts });

      // Add the initial analysis if available
      if (analysis) {
        history.push({ role: 'model', parts: [{ text: analysis }] });
      }

      // Add existing chat history
      docChatMessages.forEach(msg => {
        history.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      });

      const responseText = await sendChatMessage(
        history, 
        userMsg.text, 
        "You are an expert legal analyst assisting with a specific document. Answer questions based on the provided document context and Nigerian Law."
      );

      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setDocChatMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setDocChatLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Document Analysis" subtitle="Upload a document image or paste text for review." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText size={18}/> Paste Text</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-nigeria-green outline-none"
            placeholder="Paste contract clauses or legal text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Upload size={18}/> Upload Image</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
             {image ? (
               <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
             ) : (
               <div className="text-center p-4">
                 <p className="text-sm text-gray-500 mb-2">Click to upload document image</p>
                 <input type="file" accept="image/*" onChange={handleFileChange} className="opacity-0 absolute inset-0 cursor-pointer" />
               </div>
             )}
          </div>
          {image && <button onClick={() => setImage(null)} className="text-red-500 text-xs mt-2 text-right w-full">Remove Image</button>}
        </div>
      </div>

      <button 
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-nigeria-dark text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
        Analyze Document
      </button>

      {analysis && (
        <>
          <ResultCard title="Analysis Report" content={analysis} />
          
          {/* Document Prompt Chat Space */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-700"/>
              <h3 className="font-bold text-blue-900">Ask about this document</h3>
            </div>
            
            <div className="p-6 bg-slate-50 max-h-[400px] overflow-y-auto space-y-4">
               {docChatMessages.length === 0 && (
                 <p className="text-center text-gray-400 text-sm italic">Have questions about the analysis? Ask here.</p>
               )}
               {docChatMessages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                     msg.role === 'user' 
                       ? 'bg-blue-600 text-white rounded-br-none' 
                       : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                   }`}>
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                   </div>
                 </div>
               ))}
               {docChatLoading && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <Loader2 className="animate-spin text-blue-600" size={16} />
                    </div>
                 </div>
               )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="E.g., 'Explain the indemnity clause in simple terms'"
                value={docChatInput}
                onChange={(e) => setDocChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDocChatSend()}
              />
              <button 
                onClick={handleDocChatSend}
                disabled={docChatLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PredictionView = () => {
  const [facts, setFacts] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!facts) return;
    setLoading(true);
    const res = await predictCaseOutcome(facts);
    setPrediction(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Case Outcome Prediction" subtitle="AI analysis of precedents and judicial behavior." />
      
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-nigeria-green">
        <label className="block font-semibold text-gray-700 mb-2">Case Facts & Context</label>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[200px] focus:ring-2 focus:ring-nigeria-green outline-none"
          placeholder="Detail the facts of the case here. Include dates, locations, involved parties, and the core dispute..."
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
           <button 
            onClick={handlePredict}
            disabled={loading}
            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
            Predict Outcome
          </button>
        </div>
      </div>

      {prediction && (
        <div className="mt-8 bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden">
           <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
             <h3 className="text-purple-900 font-bold text-lg">Prediction Report</h3>
           </div>
           <div className="p-6 prose max-w-none text-gray-800 whitespace-pre-wrap text-sm md:text-base">
             {prediction}
           </div>
        </div>
      )}
    </div>
  );
};

const ChatView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello. I am U-Practice Assistant. How can I help you with your legal practice today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);
    
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
         <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
           <MessageSquare className="text-nigeria-green" size={20}/> 
           <span className="truncate">U-Practice Chat</span>
         </h2>
         <span className="text-[10px] md:text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">Online</span>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
         {messages.map((msg) => (
           <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
               msg.role === 'user' 
                 ? 'bg-nigeria-dark text-white rounded-br-none' 
                 : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
             }`}>
               <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
               <span className={`text-[10px] block mt-1 ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                 {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
             </div>
           </div>
         ))}
         {loading && (
           <div className="flex justify-start">
             <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
               <Loader2 className="animate-spin text-nigeria-green" size={16} />
               <span className="text-xs text-gray-500">Typing...</span>
             </div>
           </div>
         )}
         <div ref={scrollRef} />
       </div>

       <div className="p-4 bg-white border-t border-gray-200">
         <div className="flex gap-2">
           <input
             type="text"
             className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nigeria-green focus:border-transparent text-sm md:text-base"
             placeholder="Type a message..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           />
           <button 
             onClick={handleSend}
             disabled={loading}
             className="bg-nigeria-green hover:bg-nigeria-dark text-white p-3 rounded-full transition-colors disabled:opacity-70 shrink-0"
           >
             <Send size={18} />
           </button>
         </div>
       </div>
    </div>
  );
};

const CourtsView = () => {
    const [lookupTerm, setLookupTerm] = useState('');
    const [lookupResult, setLookupResult] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleQuickLookup = async () => {
        if(!lookupTerm) return;
        setLoading(true);
        const res = await quickLegalLookup(lookupTerm);
        setLookupResult(res);
        setLoading(false);
    }

    const courts: CourtInfo[] = [
        { name: "Supreme Court of Nigeria", jurisdiction: "Highest court in Nigeria. Appellate jurisdiction over Court of Appeal decisions.", type: "Federal", location: "Abuja" },
        { name: "Court of Appeal", jurisdiction: "Appeals from Federal High Court, State High Courts, etc.", type: "Federal", location: "Various Divisions" },
        { name: "Federal High Court", jurisdiction: "Matters related to federal revenue, taxation, customs, companies, IP.", type: "Federal", location: "All States" },
        { name: "National Industrial Court", jurisdiction: "Labor, employment, industrial relations matters.", type: "Specialized", location: "All States" },
        { name: "State High Court", jurisdiction: "General civil and criminal jurisdiction not exclusive to Federal High Court.", type: "State", location: "Each State" },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader title="Court Directory" subtitle="Jurisdictions and fast definitions." />
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <h3 className="text-amber-900 font-bold mb-2 flex items-center gap-2">
                    <Search size={18}/> Quick Legal Definitions
                </h3>
                <p className="text-sm text-amber-800 mb-4">Powered by Flash Lite.</p>
                <div className="flex flex-col md:flex-row gap-2">
                    <input 
                        value={lookupTerm}
                        onChange={(e) => setLookupTerm(e.target.value)}
                        placeholder="E.g., 'Locus Standi' or 'Habeas Corpus'"
                        className="flex-1 border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button onClick={handleQuickLookup} disabled={loading} className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin"/> : 'Define'}
                    </button>
                </div>
                {lookupResult && (
                    <div className="mt-4 bg-white p-4 rounded border border-amber-100 text-gray-800 text-sm">
                        {lookupResult}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                            <h3 className="font-bold text-lg text-nigeria-dark">{court.name}</h3>
                            <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                                court.type === 'Federal' ? 'bg-blue-100 text-blue-700' : 
                                court.type === 'State' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                            }`}>{court.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2"><strong>Location:</strong> {court.location}</p>
                        <p className="text-sm text-gray-700 leading-snug">{court.jurisdiction}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const StorageView = () => {
  const [files, setFiles] = useState<LegalDoc[]>([
    { id: '1', title: 'Okeke vs State Case File', type: 'PDF', date: '2023-10-12', status: 'Final' },
    { id: '2', title: 'Land Sale Agreement - Lekki Plot', type: 'DOCX', date: '2023-11-05', status: 'Review' },
    { id: '3', title: 'Wills & Probate Draft', type: 'PDF', date: '2023-12-01', status: 'Draft' },
  ]);

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  }

  const handleUpload = () => {
    const newFile: LegalDoc = {
      id: Date.now().toString(),
      title: 'New Uploaded Document ' + (files.length + 1),
      type: 'PDF',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setFiles([newFile, ...files]);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="Cloud Vault" subtitle="Secure, encrypted storage." />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-wrap gap-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><Lock size={18} className="text-nigeria-green"/> Encrypted Storage</h3>
          <button onClick={handleUpload} className="bg-nigeria-green text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-nigeria-dark">
            <Upload size={16} /> Upload
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <tr>
                <th className="p-4">Document Name</th>
                <th className="p-4 hidden md:table-cell">Type</th>
                <th className="p-4 hidden md:table-cell">Date Added</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {files.map(file => (
                <tr key={file.id} className="hover:bg-gray-50 group">
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                    <FileText size={18} className="text-gray-400 shrink-0" />
                    <span className="truncate max-w-[150px] md:max-w-none">{file.title}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm hidden md:table-cell">{file.type}</td>
                  <td className="p-4 text-gray-500 text-sm hidden md:table-cell">{file.date}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      file.status === 'Final' ? 'bg-green-100 text-green-700' : 
                      file.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(file.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const NewsView = () => {
  const [news, setNews] = useState<{ content: string; sources: { title: string; uri: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const res = await getLegalNews();
    setNews(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-nigeria-dark">Legal News Hub</h2>
          <p className="text-gray-600 text-sm md:text-base">Latest updates from the Judiciary and NBA.</p>
        </div>
        <button onClick={fetchNews} className="p-2 text-gray-500 hover:text-nigeria-green transition-colors" title="Refresh News">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading && !news && (
        <div className="flex flex-col items-center justify-center h-64">
           <Loader2 size={40} className="animate-spin text-nigeria-green mb-4" />
           <p className="text-gray-500">Fetching latest legal updates from the web...</p>
        </div>
      )}

      {!loading && news && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-sm md:text-base">
            {news.content ? (
               <div dangerouslySetInnerHTML={{ __html: news.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            ) : <p>No news available at the moment.</p>}
          </div>

          {news.sources.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><ExternalLink size={18}/> Sources</h3>
              <ul className="space-y-2">
                {news.sources.map((source, idx) => (
                  <li key={idx}>
                    <a href={source.uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm truncate block">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BlogView = () => {
  const [mode, setMode] = useState<'read' | 'write'>('read');
  const [topic, setTopic] = useState('');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);

  const posts: BlogPost[] = [
    { id: '1', title: 'Understanding the New Data Protection Act 2023', author: 'Barr. Chioma', excerpt: 'A breakdown of the implications for Nigerian businesses...', imageUrl: '' },
    { id: '2', title: 'Tenancy Laws in Lagos: A Guide for Landlords', author: 'Mr. Adebayo', excerpt: 'What you need to know about the tenancy law of Lagos State 2011...', imageUrl: '' },
    { id: '3', title: 'Supreme Court Ruling on Election Tribunal', author: 'Legal Insider', excerpt: 'Key takeaways from the recent judgement delivered...', imageUrl: '' },
  ];

  const handleWrite = async () => {
    if (!topic) return;
    setLoading(true);
    const res = await writeBlogArticle(topic);
    setArticle(res);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <SectionHeader title="Legal Blog" subtitle="Insights from the legal community." />
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm self-start md:self-auto">
          <button 
            onClick={() => setMode('read')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'read' ? 'bg-nigeria-green text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Read
          </button>
          <button 
            onClick={() => setMode('write')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'write' ? 'bg-nigeria-green text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Write
          </button>
        </div>
      </div>

      {mode === 'read' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                 <BookOpen className="text-gray-400" size={48} />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-800 leading-tight">{post.title}</h3>
                <p className="text-xs text-gray-500 mb-3">By {post.author}</p>
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                <button className="mt-4 text-nigeria-green text-sm font-medium hover:underline">Read More</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
             <label className="block font-semibold text-gray-700 mb-2">Article Topic</label>
             <div className="flex flex-col md:flex-row gap-2">
               <input 
                 className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigeria-green outline-none"
                 placeholder="e.g., Intellectual Property Rights in the Nigerian Music Industry"
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
               />
               <button 
                 onClick={handleWrite} 
                 disabled={loading}
                 className="bg-nigeria-dark text-white px-6 py-2 md:py-0 rounded-lg font-medium flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" /> : <PenTool size={18} />}
                 Generate
               </button>
             </div>
          </div>
          
          {article && <ResultCard title="Generated Article Draft" content={article} />}
        </div>
      )}
    </div>
  );
}

// -- Main App --

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onViewChange={setCurrentView} />;
      case View.RESEARCH: return <ResearchView />;
      case View.ANALYSIS: return <AnalysisView />;
      case View.PREDICTION: return <PredictionView />;
      case View.DRAFTING: return <DraftingView />;
      case View.CHAT: return <ChatView />;
      case View.COURTS: return <CourtsView />;
      case View.STORAGE: return <StorageView />;
      case View.NEWS: return <NewsView />;
      case View.BLOG: return <BlogView />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full md:ml-64 transition-all duration-300 w-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-nigeria-dark text-white p-4 flex items-center justify-between shadow-md z-20 shrink-0">
          <div className="flex items-center gap-2 font-serif font-bold">
             <span className="bg-white text-nigeria-green px-2 rounded text-sm">U</span>
             <span>-Practice</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:bg-white/10 p-1 rounded">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;