import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  History, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Eye, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (!u) {
        navigate('/login');
      } else {
        setUser(u);
      }
    });
  }, [navigate]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/new-analysis', label: 'New Analysis', icon: PlusCircle },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/history', label: 'History', icon: History },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-clinical-50 text-clinical-900 flex flex-col md:flex-row">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white border-r border-clinical-200 shrink-0 sticky top-0 h-screen z-30 no-print">
        {/* Brand Header */}
        <div className="p-5 border-b border-clinical-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-brand-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-clinical-950 tracking-tight">DR-SCAN</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-clinical-100 text-clinical-600 border border-clinical-200">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-clinical-500 leading-tight">
                AI-Assisted Retinal Screening
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Clinical workspace navigation">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-clinical-400">
            Clinical Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80 shadow-xs'
                      : 'text-clinical-600 hover:text-clinical-900 hover:bg-clinical-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-clinical-500 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer: System, Profile & Logout */}
        <div className="p-3 border-t border-clinical-100 space-y-2 bg-clinical-50/40">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80'
                  : 'text-clinical-600 hover:text-clinical-900 hover:bg-clinical-50'
              }`
            }
          >
            <Settings className="w-4 h-4 text-clinical-500" />
            <span>Settings</span>
          </NavLink>

          {/* User Profile Pill */}
          <div className="pt-2 border-t border-clinical-200/60 flex items-center justify-between px-2">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-clinical-900 truncate">
                {user?.name || 'Dr. Ananya Krishnan, MD'}
              </p>
              <p className="text-[11px] text-clinical-500 truncate">
                {user?.clinic || 'Metropolitan Eye Care'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-clinical-400 hover:text-rose-600 rounded hover:bg-clinical-100 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden bg-white border-b border-clinical-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-brand-700 text-white flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base text-clinical-950 tracking-tight">DR-SCAN</span>
            <span className="text-[10px] text-clinical-500 ml-1.5">AI Screening</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/new-analysis"
            className="px-2.5 py-1.5 bg-brand-700 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-clinical-600 hover:text-clinical-900 rounded-md hover:bg-clinical-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs no-print">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-xs bg-white shadow-xl flex flex-col p-5">
            <div className="flex items-center justify-between pb-4 border-b border-clinical-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-brand-700 text-white flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-clinical-950">DR-SCAN</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-clinical-400 hover:text-clinical-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200'
                          : 'text-clinical-700 hover:bg-clinical-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-clinical-500" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                    isActive
                      ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200'
                      : 'text-clinical-700 hover:bg-clinical-50'
                  }`
                }
              >
                <Settings className="w-4 h-4 text-clinical-500" />
                <span>Settings</span>
              </NavLink>
            </nav>

            <div className="pt-4 border-t border-clinical-100 space-y-3">
              <div className="text-xs">
                <p className="font-semibold text-clinical-900">{user?.name}</p>
                <p className="text-clinical-500">{user?.clinic}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Subtle Global Clinical Disclaimer Bar */}
        <div className="bg-clinical-100/70 border-b border-clinical-200/80 px-4 py-1.5 text-[11px] text-clinical-600 flex items-center justify-between no-print">
          <div className="flex items-center gap-1.5 mx-auto max-w-7xl w-full">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
            <span className="truncate">
              <strong>Clinical Decision Support:</strong> AI-assisted screening tool. Results must be reviewed by a qualified healthcare professional.
            </span>
          </div>
        </div>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
