import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Play, ArrowUpRight, Instagram, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HorizontalProject = ({ project }: { project: any }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

  return (
    <div ref={targetRef} className="relative h-[400vh] -mx-6 md:-mx-24">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 w-max px-6 md:px-24">
          {project.vimeoIds.map((vimeoId: string, index: number) => (
            <div key={index} className="w-[85vw] md:w-[70vw] shrink-0 group cursor-pointer">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 transition-transform duration-700 group-hover:scale-[0.98]">
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${['1164008481', '1164008557', '1164008644'].includes(vimeoId) ? '1&muted=1&autopause=0' : '0'}&loop=1&byline=0&title=0`}
                  className="w-full h-full object-cover pointer-events-auto scale-100 transition-transform duration-1000"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{project.category}</span>
                  <h4 className="text-3xl mt-2 font-light group-hover:italic transition-all">
                    {project.title} <span className="text-neutral-500 text-sm not-italic ml-2">({index + 1}/{project.vimeoIds.length})</span>
                  </h4>
                </div>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Home = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setTestimonials(data);
      }
    };
    
    fetchTestimonials();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        () => fetchTestimonials()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const software = [
    { name: 'After Effects', color: 'text-purple-500' },
    { name: 'Illustrator', color: 'text-orange-500' },
    { name: 'Figma', color: 'text-pink-500' },
    { name: 'Rive', color: 'text-blue-400' }
  ];

  const projects = [
    {
      id: '01',
      title: 'Official Showreel',
      category: 'Motion Design / Direction',
      vimeoIds: ['1163626468'],
    },
    {
      id: '02',
      title: 'SaaS Explainer Videos',
      category: 'Product / Marketing Motion',
      vimeoIds: [
        '1163625684',
        '1164008481',
        '1164008557',
        '1164008644',
        '1175866002'
      ],
    },
    {
      id: '03',
      title: 'Visual Storytelling',
      category: 'Experimental / 2D',
      vimeoIds: ['1143922128'],
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans selection:bg-white selection:text-black min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-8 mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-black tracking-tighter uppercase"
        >
          Levinowski
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-8 text-[10px] uppercase tracking-[0.2em] font-medium"
        >
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-24 overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.p variants={itemVariants} className="text-blue-400 font-mono text-sm mb-4 tracking-widest uppercase">
            — Abhin Das M
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-[12vw] md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-8">
            MOTION THAT <br />
            <span className="text-transparent border-b border-white/20 italic font-serif bg-clip-text bg-gradient-to-r from-white to-neutral-500">
              EVOKES
            </span> EMOTION.
          </motion.h1>
          <motion.div variants={itemVariants} className="max-w-lg">
            <p className="text-lg text-neutral-400 leading-relaxed mb-8">
              I am a motion designer specializing in high-fidelity animations and visual storytelling. Through levinowski, I transform static brands into dynamic experiences.
            </p>
            <motion.a
              href="#work"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-4 bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest"
            >
              <span>View Showreel</span>
              <Play size={14} fill="black" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Background Gradient Orbs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Work Section */}
      <section id="work" className="px-6 md:px-24 py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-20"
        >
          <div>
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Selected Work</h2>
            <h3 className="text-4xl md:text-6xl font-medium tracking-tight">Recent Projects</h3>
          </div>
          <div className="hidden md:block text-neutral-500 text-sm italic">
            01 — 03
          </div>
        </motion.div>

        <div className="space-y-40">
          {projects.map((project) => {
            if (project.vimeoIds.length > 1) {
              return <HorizontalProject key={project.id} project={project} />;
            }
            return (
              <motion.div
                key={project.id}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 transition-transform duration-700 group-hover:scale-[0.98]">
                  <iframe
                    src={`https://player.vimeo.com/video/${project.vimeoIds[0]}?autoplay=0&loop=1&byline=0&title=0`}
                    className="w-full h-full object-cover scale-100 transition-transform duration-1000"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                </div>
                <div className="mt-8 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{project.category}</span>
                    <h4 className="text-3xl mt-2 font-light group-hover:italic transition-all">{project.title}</h4>
                  </div>
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Software Toolkit */}
      <section className="py-40 bg-white text-black overflow-hidden">
        <div className="px-6 md:px-24 mb-20">
          <h2 className="text-sm font-mono uppercase tracking-widest mb-4 opacity-50">Technical Stack</h2>
          <h3 className="text-5xl md:text-7xl font-bold tracking-tighter">My Toolkit</h3>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex space-x-20 text-[10vw] font-black uppercase leading-none pr-20"
            >
              {software.map((s, i) => (
                <span key={i} className={`hover:${s.color} transition-colors cursor-default`}>{s.name} •</span>
              ))}
              {software.map((s, i) => (
                <span key={i + 4} className={`hover:${s.color} transition-colors cursor-default`}>{s.name} •</span>
              ))}
            </motion.div>
          </div>
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: [-1000, 0] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex space-x-20 text-[10vw] font-black uppercase leading-none pr-20 opacity-20"
            >
              {software.map((s, i) => (
                <span key={i} className="hover:text-neutral-500 transition-colors cursor-default">{s.name} •</span>
              ))}
              {software.map((s, i) => (
                <span key={i + 4} className="hover:text-neutral-500 transition-colors cursor-default">{s.name} •</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - ONLY RENDERS IF TESTIMONIALS EXIST */}
      {testimonials.length > 0 && (
        <section className="px-6 md:px-24 py-32 bg-[#0a0a0a] border-y border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Client Feedback</h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight">What People Say</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id || i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5 relative"
              >
                 <span className="absolute top-6 left-6 text-6xl text-white/5 font-serif leading-none">&quot;</span>
                 <p className="text-neutral-300 text-lg leading-relaxed mb-10 relative z-10 pt-4">
                   "{testimonial.quote}"
                 </p>
                 <div className="flex items-center gap-4">
                   {testimonial.logo_url ? (
                     <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                       <img src={testimonial.logo_url} alt={`${testimonial.name} company`} className="w-full h-full object-cover" />
                     </div>
                   ) : (
                     <div className="w-12 h-12 rounded-full bg-linear-to-br from-neutral-700 to-neutral-900 flex shrink-0 items-center justify-center font-bold text-white/50">
                       {testimonial.name.charAt(0)}
                     </div>
                   )}
                   <div>
                     <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mt-1">{testimonial.role}</p>
                   </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="px-6 md:px-24 py-40 bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square bg-neutral-900 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0">
              <img 
                src="/profile.jpg" 
                alt="Abhin Das M" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Crafting the future of movement.</h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-6">
              With a foundation in both design principles and technical execution, I bridge the gap between imagination and reality. My work at <strong>Levinowski</strong> is focused on creating purposeful motion that doesn't just look good, but communicates effectively.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10">
              Whether it's complex 3D systems in After Effects or lightweight Lottie animations for web via Rive/Figma, I ensure every frame counts.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/levinowski_" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-neutral-500 hover:text-white cursor-pointer" />
              </a>
              <a href="https://www.behance.net/levincarlos" target="_blank" rel="noopener noreferrer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-neutral-500 hover:text-white cursor-pointer">
                    <path d="M22 12.556c0-3.321-2.079-4.833-4.664-4.833-2.614 0-4.659 2.016-4.659 4.833 0 2.857 2.045 4.843 4.659 4.843 2.766 0 4.664-1.554 4.664-4.843zm-4.664 2.822c-1.393 0-2.316-.948-2.316-2.822 0-1.859.923-2.822 2.316-2.822 1.408 0 2.312.963 2.312 2.822 0 1.874-.904 2.822-2.312 2.822zM18.73 9.474h-2.784v-.838h2.784v.838zM10.153 14.595c0 1.144-.668 1.63-1.666 1.63H4.46V7.723h3.812c.983 0 1.611.516 1.611 1.488 0 .614-.264 1.111-.849 1.341.745.241 1.119.864 1.119 1.604v2.439zm-1.812-4.108c0-.49-.245-.694-.783-.694H6.275v1.383h1.283c.514 0 .783-.178.783-.689zm.151 2.502c0-.525-.303-.761-.884-.761H6.275v1.542h1.332c.571 0 .884-.218.884-.781z" />
                  </svg>
                </div>
              </a>
              <Twitter className="text-neutral-500 hover:text-white cursor-pointer" />
              <Linkedin className="text-neutral-500 hover:text-white cursor-pointer" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="px-6 md:px-24 py-32 border-t border-white/5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-blue-400 uppercase tracking-[0.3em] mb-8">Ready to move?</h2>
          <a
            href="mailto:hello@levinowski.design"
            className="text-[10vw] md:text-[8vw] font-bold tracking-tighter hover:text-neutral-500 transition-colors block leading-none mb-12"
          >
            LET'S CHAT.
          </a>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-neutral-500 uppercase tracking-widest pt-20">
            <div className="text-left">
              <p className="mb-2 text-white">Location</p>
              <p>Kerala, India / Remote</p>
            </div>
            <div>
              <p className="mb-2 text-white">Social</p>
              <div className="flex justify-center space-x-4">
                <a href="https://www.behance.net/levincarlos" target="_blank" rel="noopener noreferrer" className="hover:text-white">Behance</a>
                <a href="https://www.instagram.com/levinowski_" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                <a href="#" className="hover:text-white">Dribbble</a>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-2 text-white">Credits</p>
              <p>© 2026 ABHIN DAS M</p>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;
