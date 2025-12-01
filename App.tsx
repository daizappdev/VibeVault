import React, { useState, useEffect } from 'react';
import { User, Vault, Post, ViewState } from './types';
import { BottomNav } from './components/BottomNav';
import { VaultCard } from './components/VaultCard';
import { FeedItem } from './components/FeedItem';
import { CreatePost } from './components/CreatePost';
import { Scrapbook } from './components/Scrapbook';
import { ChevronLeft } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex',
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

const INITIAL_VAULTS: Vault[] = [
  {
    id: 'v1',
    name: 'The Late Night Crew 🌙',
    description: 'Only real ones allowed. 3am thoughts & chaotic energy.',
    members: [MOCK_USER, { id: 'u2', name: 'Sam', avatar: '' }, { id: 'u3', name: 'Jordan', avatar: '' }],
    coverImage: 'https://picsum.photos/seed/night/800/400',
    lastActive: new Date(),
    posts: [
      {
        id: 'p1',
        userId: 'u2',
        userName: 'Sam',
        userAvatar: 'https://picsum.photos/seed/sam/100/100',
        imageUrl: 'https://picsum.photos/seed/party/600/800',
        caption: 'Why are we like this?',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        reactions: [{ emoji: '💀', count: 3, users: ['u1'] }],
        aiVibeTags: ['chaotic', 'night owl', 'blur'],
        authenticityScore: 92
      },
      {
        id: 'p2',
        userId: 'u3',
        userName: 'Jordan',
        userAvatar: 'https://picsum.photos/seed/jordan/100/100',
        imageUrl: 'https://picsum.photos/seed/pizza/600/800',
        caption: 'Emergency pizza meeting.',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        reactions: [{ emoji: '🔥', count: 5, users: ['u1', 'u2'] }],
        aiVibeTags: ['comfort food', 'squad', 'yummy'],
        authenticityScore: 88
      }
    ]
  },
  {
    id: 'v2',
    name: 'Euro Trip 2025 🚂',
    description: 'Planning the escape.',
    members: [MOCK_USER, { id: 'u4', name: 'Casey', avatar: '' }],
    coverImage: 'https://picsum.photos/seed/travel/800/400',
    lastActive: new Date(),
    posts: []
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

  const activeVault = vaults.find(v => v.id === activeVaultId);

  // --- Handlers ---

  const handleCreatePost = (image: string, caption: string, tags: string[], authScore: number) => {
    if (!activeVaultId) {
       // In a real app, handle global post or select vault
       // For MVP, default to first vault if none selected or just mock it
    }

    const targetVaultId = activeVaultId || vaults[0].id;

    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: MOCK_USER.id,
      userName: MOCK_USER.name,
      userAvatar: MOCK_USER.avatar,
      imageUrl: image,
      caption: caption,
      timestamp: new Date(),
      reactions: [],
      aiVibeTags: tags,
      authenticityScore: authScore
    };

    setVaults(prev => prev.map(v => {
      if (v.id === targetVaultId) {
        return {
          ...v,
          posts: [newPost, ...v.posts]
        };
      }
      return v;
    }));

    // If we were in a vault, go back to it, otherwise go home
    if (activeVaultId) {
        setView('VAULT_DETAIL');
    } else {
        setView('HOME');
    }
  };

  const handleOpenVault = (id: string) => {
    setActiveVaultId(id);
    setView('VAULT_DETAIL');
  };

  const handleBack = () => {
    setActiveVaultId(null);
    setView('HOME');
  };

  // --- Render Views ---

  const renderContent = () => {
    if (view === 'CREATE_POST') {
      return (
        <CreatePost 
          currentUser={MOCK_USER} 
          availableVaults={vaults}
          onCancel={() => setView(activeVaultId ? 'VAULT_DETAIL' : 'HOME')}
          onPost={handleCreatePost}
        />
      );
    }

    if (view === 'SCRAPBOOK') {
        const vaultToUse = activeVault || vaults[0];
        return <Scrapbook vault={vaultToUse} onClose={() => setView('HOME')} />;
    }

    if (view === 'VAULT_DETAIL' && activeVault) {
      return (
        <div className="pb-24 animate-fade-in">
           {/* Vault Header */}
           <div className="relative h-64 w-full">
              <img src={activeVault.coverImage} className="w-full h-full object-cover" alt="cover"/>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-vault-dark"/>
              <button onClick={handleBack} className="absolute top-6 left-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60">
                 <ChevronLeft />
              </button>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                 <h1 className="text-3xl font-bold text-white mb-2">{activeVault.name}</h1>
                 <p className="text-white/80 text-sm backdrop-blur-sm inline-block px-2 py-1 rounded bg-black/20">
                    {activeVault.description}
                 </p>
              </div>
           </div>
           
           {/* Posts Feed */}
           <div className="px-4 py-6 max-w-lg mx-auto">
             {activeVault.posts.length === 0 ? (
                <div className="text-center text-vault-muted mt-10">
                    <p>No moments dropped yet.</p>
                    <p className="text-sm">Be the first to vibe.</p>
                </div>
             ) : (
                activeVault.posts.map(post => (
                    <FeedItem key={post.id} post={post} currentUser={MOCK_USER} />
                ))
             )}
           </div>
        </div>
      );
    }

    // Default: HOME view
    return (
      <div className="px-6 pt-12 pb-24 max-w-lg mx-auto">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white">VibeVault</h1>
                <p className="text-vault-muted text-sm">Your authentic archives</p>
            </div>
            <img src={MOCK_USER.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-vault-accent"/>
        </header>

        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-white">Your Vaults</h2>
             <button className="text-xs text-vault-pop font-bold uppercase tracking-wider">New Vault</button>
          </div>
          
          {vaults.map(vault => (
            <VaultCard key={vault.id} vault={vault} onClick={handleOpenVault} />
          ))}
        </section>

        <section className="mt-8 p-4 bg-gradient-to-r from-vault-accent/20 to-vault-pop/10 rounded-2xl border border-vault-accent/20">
            <h3 className="font-bold text-white mb-1">Daily Moment Drop ⚡</h3>
            <p className="text-xs text-vault-muted mb-3">Time left: 4h 20m</p>
            <button 
                onClick={() => setView('CREATE_POST')}
                className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm hover:scale-[1.02] transition-transform"
            >
                Post Now
            </button>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-vault-dark text-vault-text font-sans selection:bg-vault-pop selection:text-black">
      <main className="h-full">
        {renderContent()}
      </main>
      
      {view !== 'CREATE_POST' && (
        <BottomNav currentView={view} onChangeView={setView} />
      )}
    </div>
  );
};

export default App;