import React from 'react';
import { Vault } from '../types';
import { Lock, Users } from 'lucide-react';

interface VaultCardProps {
  vault: Vault;
  onClick: (vaultId: string) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, onClick }) => {
  return (
    <div 
      onClick={() => onClick(vault.id)}
      className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 group cursor-pointer active:opacity-90 transition-all"
    >
      {/* Background Image with Gradient Overlay */}
      <img 
        src={vault.coverImage} 
        alt={vault.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-vault-pop" />
              <span className="text-xs font-medium text-vault-pop uppercase tracking-wider">Private Vault</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{vault.name}</h3>
            <p className="text-xs text-vault-muted line-clamp-1">{vault.description}</p>
          </div>
          
          <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
            <Users size={12} className="text-white mr-1" />
            <span className="text-xs text-white font-medium">{vault.members.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};