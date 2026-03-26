import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.quote) {
      toast.error('Please fill in all text fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let publicLogoUrl = null;

      // 1. Upload Logo to Storage if it exists
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('testimonial_logos')
          .upload(filePath, logoFile);

        if (uploadError) {
          throw new Error('Failed to upload logo. ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('testimonial_logos')
          .getPublicUrl(filePath);

        publicLogoUrl = publicUrl;
      }

      // 2. Insert Testimonial record into Database
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name,
          role: formData.role,
          quote: formData.quote,
          logo_url: publicLogoUrl,
          status: 'pending'
        });

      if (insertError) {
        throw new Error('Failed to submit testimonial. ' + insertError.message);
      }

      toast.success('Testimonial submitted successfully!');
      setFormData({ name: '', role: '', quote: '' });
      setLogoFile(null);
      setPreviewUrl(null);
      
      // Optionally could wait and redirect, but form reset is fine.
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen py-20 px-6 md:px-24 selection:bg-white selection:text-black">
      <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-12">
        <ChevronLeft size={20} className="mr-2" />
        <span className="text-sm uppercase tracking-widest font-mono">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-neutral-900/40 p-10 rounded-3xl border border-white/5"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">Share Your Experience</h1>
          <p className="text-neutral-400">Your feedback helps shape the future of Levinowski motion design.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-neutral-500 mb-3">Company Logo / Profile Picture (Optional)</label>
            <div className="flex items-center gap-6">
              <div 
                className={`w-24 h-24 rounded-full border-2 border-dashed flex shrink-0 items-center justify-center overflow-hidden transition-colors ${previewUrl ? 'border-transparent bg-neutral-800' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-500'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-neutral-500" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="logo-upload"
                  className="inline-block bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest cursor-pointer hover:scale-105 transition-transform"
                >
                  Upload Image
                </label>
                <p className="text-xs text-neutral-500 mt-2">JPEG, PNG or WebP. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-neutral-500 mb-3">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-neutral-500 mb-3">Role / Company</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="CEO at Acme Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-neutral-500 mb-3">Your Feedback</label>
            <textarea
              required
              rows={5}
              value={formData.quote}
              onChange={(e) => setFormData({...formData, quote: e.target.value})}
              className="w-full bg-neutral-900 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors resize-none"
              placeholder="What was it like working together?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin mr-2" size={18} /> Submitting...</>
            ) : (
              'Submit Testimonial'
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};

export default SubmitTestimonial;
