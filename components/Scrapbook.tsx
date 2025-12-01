import React, { useState, useEffect } from 'react';
import { Vault, Post } from '../types';
import { generateScrapbookStory } from '../services/geminiService';
import { Sparkles, ArrowLeft, Share2 } from 'lucide-react';

interface ScrapbookProps {
  vault: Vault;
  onClose: () => void;
}

export const Scrapbook: React.FC<ScrapbookProps> = ({ vault, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<{title: string, narrative: string, mood: string} | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
        // Only generate if we have posts
        if (vault.posts.length > 0) {
            const result = await generateScrapbookStory(vault.posts, vault.name);
            setStory(result);
        }
        setLoading(false);
    };
    fetchStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full p-6 pt-12 overflow-y-auto no-scrollbar">
       <button onClick={onClose} className="mb-6 flex items-center text-vault-muted hover:text-white">
        <ArrowLeft size={20} className="mr-2"/> Back to Vault
       </button>

       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vault-accent to-pink-500 mb-2">
            Weekly Recap
         </h1>
         <p className="text-vault-muted text-sm">AI-Generated from your crew's raw moments</p>
       </div>

       {loading ? (
         <div className="flex-grow flex flex-col items-center justify-center space-y-4">
            <Sparkles size={48} className="text-vault-pop animate-spin" />
            <p className="animate-pulse text-sm font-mono">Curating vibes...</p>
         </div>
       ) : story ? (
         <div className="space-y-6">
            {/* Story Card */}
            <div className="bg-vault-card border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Sparkles size={100} />
                </div>

                <div className="relative z-10">
                    <div className="text-4xl mb-4">{story.mood}</div>
                    <h2 className="text-2xl font-bold text-white mb-4">{story.title}</h2>
                    <p className="text-gray-300 leading-relaxed font-light text-lg">
                        {story.narrative}
                    </p>
                </div>
            </div>

            {/* Collage Grid (Simulated) */}
            <div className="grid grid-cols-2 gap-2">
                {vault.posts.slice(0, 4).map((post, i) => (
                    <div key={post.id} className={`rounded-xl overflow-hidden aspect-square ${i === 0 ? 'col-span-2 aspect-video' : ''}`}>
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"/>
                    </div>
                ))}
            </div>

            <button className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Share2 size={18} /> Share Recap
            </button>
         </div>
       ) : (
           <div className="text-center text-vault-muted mt-20">
               <p>Not enough moments yet to generate a scrapbook. <br/>Start dropping moments!</p>
           </div>
       )}
       <div className="h-24"></div>
    </div>
  );
};