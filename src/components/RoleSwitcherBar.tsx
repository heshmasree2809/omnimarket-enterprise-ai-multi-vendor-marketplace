import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ShoppingBag, Store, UserCheck } from 'lucide-react';
import { UserRole } from '../types/marketplace';

export const RoleSwitcherBar: React.FC = () => {
  const { user, role, switchDemoRole } = useAuth();

  const roles: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'customer', label: 'Customer View', icon: <ShoppingBag className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { id: 'seller', label: 'Seller Portal', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    { id: 'admin', label: 'Admin Dashboard', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  ];

  return (
    <div className="bg-zinc-900 text-zinc-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-medium text-zinc-400">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          Active Account: <strong className="text-white font-semibold">{user?.name}</strong> ({role.toUpperCase()})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-zinc-500 font-medium hidden sm:inline">Switch Demo Mode:</span>
        <div className="flex items-center gap-1">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchDemoRole(r.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all border font-medium ${
                  isActive
                    ? `${r.color} font-semibold ring-1 ring-zinc-700`
                    : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
