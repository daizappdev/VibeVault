import React, { useState, useRef } from 'react';
import { Camera, X, Sparkles, Send, Upload } from 'lucide-react';
import { analyzeImageVibe } from '../services/geminiService';
import { Vault, User } from '../types';

interface CreatePostProps {
  onCancel: () => void;
  onPost: (image: string, caption: string, tags: string[], authScore: number) => void;
  availableVaults: Vault[];
  currentUser: User;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onCancel, onPost, availableVaults }) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{tags: string[], score: number, desc: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null); // Reset analysis on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    
    // Extract base64 without prefix
    const base64Data = image.split(',')[1];
    const result = await analyzeImageVibe(base64Data, caption);
    
    setAnalysis({
      tags: result.tags,
      score: result.authenticityScore,
      desc: result.vibeDescription
    });
    setIsAnalyzing(false);
  };

  const handlePost = () => {
    if (image && analysis) {
      onPost(image, caption, analysis.tags, analysis.score);
    }
  };

  return (
    <div className="flex flex-col h-full bg-vault-dark text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onCancel}><X className="text-white" /></button>
        <h2 className="font-bold text-lg">New Moment Drop</h2>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Image Area */}
      <div className="flex-grow flex flex-col items-center justify-center relative bg-vault-card rounded-2xl border border-dashed border-vault-muted/30 overflow-hidden mb-6">
        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-md"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center cursor-pointer p-8 text-center"
          >
            <div className="bg-vault-accent/10 p-4 rounded-full mb-4">
              <Camera size={32} className="text-vault-accent" />
            </div>
            <p className="font-medium mb-1">Capture the Real You</p>
            <p className="text-xs text-vault-muted">No filters. No retakes. Just vibes.</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-20">
        <input
          type="text"
          placeholder="Caption this vibe..."
          className="w-full bg-transparent border-b border-white/10 p-3 text-lg focus:outline-none focus:border-vault-pop transition-colors"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {image && !analysis && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-vault-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="animate-spin" size={20} /> Analyzing Vibe...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Run Authenticity Check
              </>
            )}
          </button>
        )}

        {analysis && (
          <div className="bg-vault-card p-4 rounded-xl border border-white/10 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase text-vault-muted font-bold tracking-wider">AI Vibe Analysis</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${analysis.score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {analysis.score}% Authentic
              </span>
            </div>
            <p className="text-sm italic text-white/90 mb-3">"{analysis.desc}"</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {analysis.tags.map(tag => (
                <span key={tag} className="text-xs bg-vault-pop/10 text-vault-pop px-2 py-1 rounded-md border border-vault-pop/20">
                  #{tag}
                </span>
              ))}
            </div>
            
            <button
              onClick={handlePost}
              className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <Send size={18} /> Post to Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
};