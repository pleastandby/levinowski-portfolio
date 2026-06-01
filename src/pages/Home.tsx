import { motion, type Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Play, ArrowUpRight, Instagram, Twitter, Linkedin, ChevronDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HorizontalProject = ({ project }: { project: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);
      
      return () => {
        el.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [project.vimeoIds]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/carousel -mx-6 md:-mx-24">
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-6 md:left-24 z-20 flex items-center pointer-events-none">
        <motion.button
          onClick={() => scroll('left')}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: canScrollLeft ? 1 : 0, 
            scale: canScrollLeft ? 1 : 0.8,
            pointerEvents: canScrollLeft ? 'auto' : 'none' 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-neutral-200 pointer-events-auto cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="absolute inset-y-0 right-6 md:right-24 z-20 flex items-center pointer-events-none">
        <motion.button
          onClick={() => scroll('right')}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: canScrollRight ? 1 : 0, 
            scale: canScrollRight ? 1 : 0.8,
            pointerEvents: canScrollRight ? 'auto' : 'none' 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-neutral-200 pointer-events-auto cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Scrollable container */}
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-6 md:px-24 pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {project.vimeoIds.map((vimeoId: string, index: number) => (
          <div key={index} className="w-[85vw] md:w-[70vw] shrink-0 snap-center group cursor-pointer">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 transition-transform duration-700 group-hover:scale-[0.98]">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${['1185381870', '1164008481', '1164008557', '1164008644'].includes(vimeoId) ? '1&muted=1&autopause=0' : '0'}&loop=1&byline=0&title=0`}
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
      </div>
    </div>
  );
};

const ToolCard = ({ tool }: { tool: any }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-950/40 p-8 transition-colors duration-500 hover:border-white/10 backdrop-blur-xs flex flex-col justify-between h-[280px] group"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.05), transparent 80%)`,
        }}
      />
      
      {/* Corner Glow based on Tool Color */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-br ${tool.color}`}
      />

      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
            {tool.useCase}
          </span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse bg-gradient-to-r ${tool.color}`} />
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{tool.level}</span>
          </div>
        </div>

        <h4 className="text-3xl font-light tracking-tight text-white mb-4 group-hover:italic transition-all duration-300">
          {tool.name}
        </h4>
        <p className="text-sm text-neutral-400 leading-relaxed font-light">
          {tool.description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: tool.percentage }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${tool.color}`}
          />
        </div>
        <span className="text-[10px] font-mono text-neutral-500 ml-4">{tool.percentage}</span>
      </div>
    </motion.div>
  );
};

const InteractiveHero3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const parent = canvas.parentElement;
    let width = (canvas.width = parent?.clientWidth || 500);
    let height = (canvas.height = parent?.clientHeight || 500);

    const size = Math.min(width, height) * 0.18;

    const vertices = [
      { x: -size, y: -size, z: -size },
      { x: size, y: -size, z: -size },
      { x: size, y: size, z: -size },
      { x: -size, y: size, z: -size },
      { x: -size, y: -size, z: size },
      { x: size, y: -size, z: size },
      { x: size, y: size, z: size },
      { x: -size, y: size, z: size },
    ];

    const faces = [
      { indices: [0, 1, 2, 3], glowColor: 'rgba(59, 130, 246, ' },
      { indices: [4, 5, 6, 7], glowColor: 'rgba(168, 85, 247, ' },
      { indices: [0, 1, 5, 4], glowColor: 'rgba(255, 255, 255, ' },
      { indices: [2, 3, 7, 6], glowColor: 'rgba(255, 255, 255, ' },
      { indices: [0, 3, 7, 4], glowColor: 'rgba(59, 130, 246, ' },
      { indices: [1, 2, 6, 5], glowColor: 'rgba(168, 85, 247, ' }
    ];

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseRef.current.targetX = (clientX - width / 2) * 0.15;
      mouseRef.current.targetY = (clientY - height / 2) * 0.15;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('resize', handleResize);

    const rotateX = (x: number, y: number, z: number, angle: number) => {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const y1 = y * cos - z * sin;
      const z1 = y * sin + z * cos;
      return { x, y: y1, z: z1 };
    };

    const rotateY = (x: number, y: number, z: number, angle: number) => {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x1 = x * cos + z * sin;
      const z1 = -x * sin + z * cos;
      return { x: x1, y, z: z1 };
    };

    const rotateZ = (x: number, y: number, z: number, angle: number) => {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x1 = x * cos - y * sin;
      const y1 = x * sin + y * cos;
      return { x: x1, y: y1, z };
    };

    const focalLength = 350;
    let autoAngleX = 25;
    let autoAngleY = 35;
    let autoAngleZ = 12;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const finalAngleX = autoAngleX + mouseRef.current.y * 0.2;
      const finalAngleY = autoAngleY + mouseRef.current.x * 0.2;
      const finalAngleZ = autoAngleZ;

      const projected = vertices.map((v) => {
        let r = rotateX(v.x, v.y, v.z, finalAngleX);
        r = rotateY(r.x, r.y, r.z, finalAngleY);
        r = rotateZ(r.x, r.y, r.z, finalAngleZ);

        const scale = focalLength / (focalLength + r.z);
        const screenX = r.x * scale + width / 2;
        const screenY = r.y * scale + height / 2;

        return { screenX, screenY, z: r.z, scale };
      });

      const sortedFaces = faces.map((face) => {
        const avgZ = face.indices.reduce((sum, idx) => sum + projected[idx].z, 0) / 4;
        return { ...face, avgZ };
      }).sort((a, b) => b.avgZ - a.avgZ);

      sortedFaces.forEach((face) => {
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projected[idx];
          if (i === 0) {
            ctx.moveTo(pt.screenX, pt.screenY);
          } else {
            ctx.lineTo(pt.screenX, pt.screenY);
          }
        });
        ctx.closePath();

        const p0 = projected[face.indices[0]];
        const p2 = projected[face.indices[2]];
        
        const gradient = ctx.createLinearGradient(p0.screenX, p0.screenY, p2.screenX, p2.screenY);
        gradient.addColorStop(0, `${face.glowColor}0.08)`);
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(0.7, `${face.glowColor}0.04)`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.save();
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projected[idx];
          const centerX = face.indices.reduce((sum, id) => sum + projected[id].screenX, 0) / 4;
          const centerY = face.indices.reduce((sum, id) => sum + projected[id].screenY, 0) / 4;
          const insetX = pt.screenX + (centerX - pt.screenX) * 0.06;
          const insetY = pt.screenY + (centerY - pt.screenY) * 0.06;

          if (i === 0) {
            ctx.moveTo(insetX, insetY);
          } else {
            ctx.lineTo(insetX, insetY);
          }
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        if (face.avgZ < 0) {
          const shimmerGrad = ctx.createLinearGradient(
            width / 2 - size, height / 2 - size,
            width / 2 + size, height / 2 + size
          );
          const shimmerPos = Math.abs(Math.sin((autoAngleY * Math.PI) / 180));
          shimmerGrad.addColorStop(Math.max(0, shimmerPos - 0.15), 'rgba(255, 255, 255, 0)');
          shimmerGrad.addColorStop(shimmerPos, 'rgba(255, 255, 255, 0.12)');
          shimmerGrad.addColorStop(Math.min(1, shimmerPos + 0.15), 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = shimmerGrad;
          ctx.beginPath();
          face.indices.forEach((idx, i) => {
            const pt = projected[idx];
            if (i === 0) ctx.moveTo(pt.screenX, pt.screenY);
            else ctx.lineTo(pt.screenX, pt.screenY);
          });
          ctx.closePath();
          ctx.fill();
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projected[idx];
          if (i === 0) ctx.moveTo(pt.screenX, pt.screenY);
          else ctx.lineTo(pt.screenX, pt.screenY);
        });
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projected[idx];
          if (pt.z < -size * 0.3) {
            if (i === 0) ctx.moveTo(pt.screenX, pt.screenY);
            else ctx.lineTo(pt.screenX, pt.screenY);
          }
        });
        ctx.stroke();
      });

      autoAngleX += 0.12;
      autoAngleY += 0.16;
      autoAngleZ += 0.04;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full max-w-full max-h-full pointer-events-none opacity-85 md:opacity-95"
    />
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
    { 
      name: 'After Effects', 
      color: 'from-purple-500 to-indigo-500', 
      description: 'Complex 3D motion systems, kinetic typography, character rigging, and high-fidelity rendering.',
      level: 'Mastery',
      useCase: 'Kinetic & 3D Motion',
      percentage: '95%'
    },
    { 
      name: 'Illustrator', 
      color: 'from-orange-500 to-amber-500', 
      description: 'Precision vector assets, layout design, storyboarding, and character asset optimization.',
      level: 'Intermediate',
      useCase: 'Vector Design',
      percentage: '70%'
    },
    { 
      name: 'Figma', 
      color: 'from-pink-500 to-rose-500', 
      description: 'UI/UX interaction logic, digital design systems, and responsive layout prototyping.',
      level: 'Intermediate',
      useCase: 'Interface Rigging',
      percentage: '70%'
    },
    { 
      name: 'Rive', 
      color: 'from-cyan-400 to-blue-500', 
      description: 'Interactive real-time web assets, state-machine scripting, and lightweight interactive vectors.',
      level: 'Beginner',
      useCase: 'Interactive Vector',
      percentage: '40%'
    }
  ];

  const projects = [
    {
      id: '01',
      title: 'SaaS Explainer Videos',
      category: 'Product / Marketing Motion',
      vimeoIds: [
        '1163625684',
        '1185381870',
        '1175866002'
      ],
    },
    {
      id: '02',
      title: 'Visual Storytelling',
      category: 'Experimental / 2D',
      vimeoIds: ['1143922128'],
    },
    {
      id: '03',
      title: 'Motion GIFs',
      category: 'UI / Looping Animations',
      vimeoIds: [
        '1164008481',
        '1164008557',
        '1164008644'
      ],
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
      <section className="relative min-h-screen flex items-center px-6 md:px-24 overflow-hidden py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.p variants={itemVariants} className="text-blue-400 font-mono text-sm mb-4 tracking-widest uppercase">
              — Abhin Das M
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-[10vw] lg:text-[6vw] font-bold leading-[0.9] tracking-tighter mb-8">
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
                <span>View Work</span>
                <Play size={14} fill="black" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Constellation Orb */}
          <div className="relative w-full h-[45vh] lg:h-[65vh] flex items-center justify-center pointer-events-auto">
            <InteractiveHero3D />
          </div>
        </div>

        {/* Background Gradient Orbs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none"
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
      <section className="py-40 bg-[#050505] text-[#e5e5e5] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="px-6 md:px-24 mb-20 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">— Technical Stack</h2>
            <h3 className="text-5xl md:text-7xl font-bold tracking-tighter">My Toolkit</h3>
          </div>
          <p className="max-w-md text-neutral-400 font-light leading-relaxed text-sm md:text-base">
            Bridging the gap between conceptual high-fidelity design and interactive digital execution with industry-standard motion pipelines.
          </p>
        </div>

        <div className="px-6 md:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {software.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
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

          {/* Back to Top button */}
          <div className="mt-20 flex justify-center">
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-500 group-hover:bg-white group-hover:border-white">
                <ArrowUp className="w-6 h-6 text-neutral-400 transition-colors duration-500 group-hover:text-black group-hover:-translate-y-0.5" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 group-hover:text-white transition-colors uppercase">
                Back to Top
              </span>
            </motion.button>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;
