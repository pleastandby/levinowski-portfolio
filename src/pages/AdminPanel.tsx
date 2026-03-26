import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, X, Trash2, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchTestimonials();
    } else {
      toast.error('Incorrect password');
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Failed to load testimonials');
      console.error(error);
    } else if (data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('testimonials')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Testimonial ${newStatus}`);
      fetchTestimonials();
    }
  };

  const deleteTestimonial = async (id: string, logoUrl: string | null) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    // Delete associated logo if exists
    if (logoUrl) {
      try {
        const urlObj = new URL(logoUrl);
        const parts = urlObj.pathname.split('/');
        const filePath = parts.slice(parts.indexOf('testimonial_logos') + 1).join('/');
        
        if (filePath) {
           await supabase.storage.from('testimonial_logos').remove([filePath]);
        }
      } catch (e) {
        console.error('Error parsing or deleting logo', e);
      }
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete testimonial');
    } else {
      toast.success('Testimonial deleted');
      fetchTestimonials();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen flex items-center justify-center p-6 selection:bg-white selection:text-black">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-white/10 p-10 rounded-3xl w-full max-w-md text-center">
          <h1 className="text-3xl font-medium mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full bg-black text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors text-center font-mono tracking-widest"
            />
            <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors">
              Unlock Panel
            </button>
          </form>
          <Link to="/" className="inline-block mt-8 text-neutral-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
            Return to Portfolio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen py-20 px-6 md:px-24 selection:bg-white selection:text-black">
      <div className="flex justify-between items-center mb-12">
        <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft size={20} className="mr-2" />
          <span className="text-sm uppercase tracking-widest font-mono">Back to Home</span>
        </Link>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          Lock Panel
        </button>
      </div>

      <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-12">Manage Testimonials</h1>

      {loading ? (
        <div className="text-center text-neutral-500 py-20">Loading records...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center text-neutral-500 py-20 bg-neutral-900/40 rounded-3xl border border-white/5">
          No testimonials found.
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
              
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-4">
                  {t.logo_url ? (
                    <img src={t.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white/50 shrink-0">
                       {t.name.charAt(0)}
                     </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white leading-tight">{t.name}</h3>
                    <p className="text-xs text-neutral-500 font-mono tracking-widest">{t.role}</p>
                  </div>
                  <div className="ml-auto md:ml-4 flex items-center">
                    {t.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center"><Clock size={12} className="mr-1" /> Pending</span>}
                    {t.status === 'approved' && <span className="bg-green-500/10 text-green-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center"><CheckCircle2 size={12} className="mr-1" /> Approved</span>}
                    {t.status === 'rejected' && <span className="bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center"><X size={12} className="mr-1" /> Rejected</span>}
                  </div>
                </div>
                <p className="text-neutral-300 italic">"{t.quote}"</p>
                <p className="text-[10px] text-neutral-600 font-mono mt-4">
                  Submitted: {new Date(t.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                {t.status !== 'approved' && (
                  <button onClick={() => updateStatus(t.id, 'approved')} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    <Check size={16} className="md:mr-2" /> <span className="hidden md:inline">Approve</span>
                  </button>
                )}
                {t.status !== 'rejected' && (
                  <button onClick={() => updateStatus(t.id, 'rejected')} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    <X size={16} className="md:mr-2" /> <span className="hidden md:inline">Reject</span>
                  </button>
                )}
                <button onClick={() => deleteTestimonial(t.id, t.logo_url)} className="flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
