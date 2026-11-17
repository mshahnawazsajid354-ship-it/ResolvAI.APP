import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Sparkles, 
  TrendingUp, 
  Archive, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { ActiveView } from '../types';

interface NavigationProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  productName: string;
  onOpenFounderMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onNavigate,
  productName,
  onOpenFounderMode,
}) => {
  const navItems: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { view: 'gym', label: 'Communication Gym', icon: <Dumbbell className="w-5 h-5" /> },
    { view: 'expert', label: 'AI Expert', icon: <Sparkles className="w-5 h-5" /> },
    { view: 'progress', label: 'Progress & Trends', icon: <TrendingUp className="w-5 h-5" /> },
    { view: 'vault', label: 'Reflection Vault', icon: <Archive className="w-5 h-5" /> },
    { view: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar (Locked, Non-scrolling left sidebar) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-surface-border fixed top-0 left-0 bottom-0 z-30 p-4 justify-between select-none overflow-y-auto">
        <div>
          {/* Logo / Brand */}
          <div className="px-3 py-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-focusBlue flex items-center justify-center text-white font-bold text-sm shadow-soft">
                P1
              </div>
              <div>
                <h1 className="font-semibold text-charcoal text-sm leading-tight tracking-tight">
                  {productName}
                </h1>
                <p className="text-[11px] text-charcoal-faint tracking-wide uppercase font-medium">
                  Discipline Container
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-focusBlue-light text-focusBlue font-semibold'
                      : 'text-charcoal-muted hover:bg-surface-subtle hover:text-charcoal'
                  }`}
                >
                  <span className={isActive ? 'text-focusBlue' : 'text-charcoal-faint'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Founder Blueprint & System status */}
        <div className="pt-4 border-t border-surface-border space-y-2">
          <button
            onClick={onOpenFounderMode}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-charcoal-muted hover:text-charcoal bg-surface-subtle hover:bg-surface-muted rounded-md transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-focusBlue" />
              <span>Founder Blueprint</span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-surface-border text-charcoal-faint">
              Phase 1-6
            </span>
          </button>
          <div className="px-3 py-1 text-[11px] text-charcoal-faint">
            "Structure is not a cage; it is the rhythm."
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Accessible touch targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-surface-border z-30 px-2 py-1.5 flex items-center justify-around shadow-medium">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg min-w-[50px] transition-colors ${
                isActive ? 'text-focusBlue font-medium' : 'text-charcoal-faint hover:text-charcoal'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-focusBlue-light' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-[62px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
