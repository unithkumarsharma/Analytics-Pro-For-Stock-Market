import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('trader@analyticspro.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Hint: use admin/admin');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] grid-bg noise-overlay flex items-center justify-center p-4">
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              Analytics<span className="text-blue-400">Pro</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            Enterprise AI Market Intelligence
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card p-6 sm:p-8 border border-white/[0.08] relative">
          <h2 className="text-lg font-bold text-white mb-1">Terminal Authentication</h2>
          <p className="text-xs text-slate-500 mb-6">Enter secure credentials to establish a session</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-400 mb-5 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Operator ID (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-blue-500/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Access Key (Password)
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-blue-500/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 mt-6 shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              {submitting ? 'Connecting...' : 'Establish Connection'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Helper credentials footer info */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-slate-500 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold text-slate-400">Mock Demonstration Session:</span>
            <p>
              Operator ID: <span className="font-mono text-slate-300">trader@analyticspro.com</span>
            </p>
            <p>
              Access Key: <span className="font-mono text-slate-300">admin</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
