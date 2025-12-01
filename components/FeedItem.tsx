import React, { useState } from 'react';
import { Post, User } from '../types';
import { Smile, Heart, Flame, Skull } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedItemProps {
  post: Post;
  currentUser: User;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post, currentUser }) => {
  const [showReactions, setShowReactions] = useState(false);

  // Helper to handle reaction selection (mock logic)
  const handleReact = (emoji: string) => {
    setShowReactions(false);
    // In a real app, this would update the backend
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full border border-white/10" />
          <div>
            <p className="font-bold text-sm">{post.userName}</p>
            <p className="text-xs text-vault-muted">{formatDistanceToNow(post.timestamp)} ago</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${post.authenticityScore > 80 ? 'bg-vault-pop' : 'bg-yellow-500'}`}></div>
            <span className="text-xs font-mono text-white/50">{post.authenticityScore}% Real</span>
        </div>
      </div>

      {/* Image Content */}
      <div className="relative rounded-2xl overflow-hidden mb-3 border border-white/5 aspect-[4/5] bg-vault-card">
        <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
        
        {/* Vibe Tags Overlay */}
        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap max-w-[80%]">
          {post.aiVibeTags.map(tag => (
            <span key={tag} className="text-[10px] bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md border border-white/10">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions & Caption */}
      <div className="px-1 relative">
        <div className="flex justify-between items-start mb-2">
           <p className="text-sm text-gray-200 leading-relaxed max-w-[85%]">
            <span className="font-bold mr-2">{post.userName}</span>
            {post.caption}
          </p>
          
          <button 
            onClick={() => setShowReactions(!showReactions)}
            className="bg-vault-card p-2 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Smile size={20} className="text-vault-pop" />
          </button>
        </div>

        {/* Reaction Popover */}
        {showReactions && (
          <div className="absolute right-0 bottom-full mb-2 bg-vault-card/90 backdrop-blur-xl border border-white/10 p-2 rounded-full flex gap-2 animate-pulse-fast z-10 shadow-xl">
             <button onClick={() => handleReact('🔥')} className="hover:scale-125 transition-transform p-1">🔥</button>
             <button onClick={() => handleReact('💀')} className="hover:scale-125 transition-transform p-1">💀</button>
             <button onClick={() => handleReact('🥺')} className="hover:scale-125 transition-transform p-1">🥺</button>
             <button onClick={() => handleReact('👀')} className="hover:scale-125 transition-transform p-1">👀</button>
          </div>
        )}

        {/* Existing Reactions */}
        {post.reactions.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden py-1">
             {post.reactions.map((r, i) => (
               <div key={i} className="bg-vault-card rounded-full px-2 py-0.5 text-xs border border-white/5 flex items-center gap-1">
                 <span>{r.emoji}</span>
                 <span className="font-bold">{r.count}</span>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};