import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Database, Sparkles, Image as ImageIcon, Key, X, Zap, Loader2, Save } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, db, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from '../lib/firebase';

interface ArchiveTerminalProps {
  onClose: () => void;
}

export default function ArchiveTerminal({ onClose }: ArchiveTerminalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'standard' | 'deep' | 'quick' | 'image'>('standard');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [history, setHistory] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'queries'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isProcessing) return;

    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      const token = await user.getIdToken();
      let endpoint = '/api/terminal/chat';
      let payload: any = { prompt: currentInput, mode };

      if (mode === 'image') {
        endpoint = '/api/terminal/image';
        payload = { prompt: currentInput, size: imageSize };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed request');

      await addDoc(collection(db, 'queries'), {
        userId: user.uid,
        prompt: currentInput,
        mode,
        response: mode === 'image' ? data.imageUrl : data.text,
        type: mode === 'image' ? 'image' : 'text',
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error(error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-luxury-void/90 backdrop-blur-md flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-luxury-void/90 backdrop-blur-xl flex flex-col md:p-10 pointer-events-auto"
    >
      <div className="flex-1 w-full max-w-5xl mx-auto bg-luxury-void border border-luxury-platinum/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-luxury-platinum/10 flex items-center justify-between px-6 bg-luxury-void/50">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-luxury-gold" />
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-luxury-platinum">Sovereign Intel Terminal</h2>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-luxury-platinum/20" />
                  <span className="font-mono text-[10px] text-luxury-platinum/60 uppercase">{user.displayName}</span>
                </div>
                <button onClick={handleLogout} className="font-mono text-[10px] tracking-widest text-luxury-platinum/40 hover:text-luxury-platinum uppercase">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-luxury-gold hover:text-luxury-platinum uppercase transition-colors">
                <Key className="w-3 h-3" /> Connect Identity
              </button>
            )}
            <button onClick={onClose} className="p-2 text-luxury-platinum/40 hover:text-luxury-platinum transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {user ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none flex flex-col gap-6">
              {history.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <Database className="w-12 h-12 text-luxury-gold mb-4" />
                  <p className="font-mono text-xs uppercase tracking-widest text-luxury-platinum">Database initialized.<br/>Awaiting queries.</p>
                </div>
              )}
              {history.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col gap-3">
                  <div className="self-end max-w-[80%] bg-luxury-platinum/5 border border-luxury-platinum/10 p-4 font-serif text-lg text-luxury-platinum">
                    {item.prompt}
                  </div>
                  <div className="self-start max-w-[80%] bg-luxury-void border border-luxury-gold/20 p-4 font-mono text-sm text-luxury-gold/90 whitespace-pre-wrap shadow-[0_0_20px_rgba(168,135,74,0.05)]">
                    {item.type === 'image' ? (
                      <img src={item.response} alt="Generated artifact" className="w-full h-auto max-w-lg object-contain" />
                    ) : (
                      item.response
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="self-start bg-luxury-void border border-luxury-gold/20 p-4">
                  <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-luxury-platinum/10 bg-luxury-void/50">
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => setMode('standard')} className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-colors ${mode === 'standard' ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-luxury-platinum/20 text-luxury-platinum/50 hover:border-luxury-platinum/50'}`}>
                  <Sparkles className="w-3 h-3" /> Standard
                </button>
                <button onClick={() => setMode('quick')} className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-colors ${mode === 'quick' ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-luxury-platinum/20 text-luxury-platinum/50 hover:border-luxury-platinum/50'}`}>
                  <Zap className="w-3 h-3" /> Quick Query
                </button>
                <button onClick={() => setMode('deep')} className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-colors ${mode === 'deep' ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-luxury-platinum/20 text-luxury-platinum/50 hover:border-luxury-platinum/50'}`}>
                  <Database className="w-3 h-3" /> Deep Analysis
                </button>
                <button onClick={() => setMode('image')} className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-colors ${mode === 'image' ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-luxury-platinum/20 text-luxury-platinum/50 hover:border-luxury-platinum/50'}`}>
                  <ImageIcon className="w-3 h-3" /> Image Gen
                </button>
                
                {mode === 'image' && (
                  <div className="flex items-center gap-2 ml-auto border-l border-luxury-platinum/20 pl-4">
                    {['1K', '2K', '4K'].map(size => (
                      <button 
                        key={size}
                        onClick={() => setImageSize(size as any)}
                        className={`px-2 py-1 font-mono text-[9px] uppercase border ${imageSize === size ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-luxury-platinum/50 hover:text-luxury-platinum'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={mode === 'image' ? "Describe the artifact to materialize..." : "Enter your query..."}
                  className="flex-1 bg-luxury-platinum/5 border border-luxury-platinum/20 px-4 py-3 font-serif text-lg text-luxury-platinum placeholder-luxury-platinum/30 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                  disabled={isProcessing}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="px-8 py-3 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold hover:bg-luxury-gold/20 disabled:opacity-50 font-mono text-xs tracking-widest uppercase transition-colors"
                >
                  Execute
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <Key className="w-16 h-16 text-luxury-gold mb-6 opacity-80" />
            <h3 className="font-serif text-3xl text-luxury-platinum mb-4 uppercase tracking-widest">Identify Yourself</h3>
            <p className="font-mono text-sm text-luxury-platinum/60 max-w-md mx-auto leading-relaxed mb-8">
              Access to the Sovereign Intel Terminal is restricted. Please connect your verified identity via Google to continue.
            </p>
            <button 
              onClick={handleLogin}
              className="flex items-center gap-3 px-8 py-4 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 transition-colors uppercase tracking-[0.2em] font-mono text-xs"
            >
              <Key className="w-4 h-4" /> Initialize Auth Sequence
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
