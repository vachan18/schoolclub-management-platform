import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, BookOpen, Star, ChevronRight, Sparkles, Trophy, Heart, Facebook, Youtube, Linkedin, Instagram, Twitter, Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppData } from '../context/AppDataContext';
import AnimatedCounter from './AnimatedCounter';
import UpcomingEvents from './UpcomingEvents';
import ClubLeadersShowcase from './ClubLeadersShowcase';

interface LandingPageProps {
  onRoleSelect: (role: 'student' | 'leader' | 'admin') => void;
}

const iconMap: { [key: string]: React.ElementType } = {
    Trophy, Users, Sparkles, Heart
};

const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  const { testimonials, impactStats } = useAppData();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    { icon: BookOpen, title: 'Discover Clubs', description: 'Browse a diverse range of technical and cultural clubs to find your passion.', color: 'blue' },
    { icon: Users, title: 'Collaborate & Innovate', description: 'Connect with peers on exciting projects, from race cars to AI models.', color: 'purple' },
    { icon: Shield, title: 'Streamlined Management', description: 'Efficiently manage members, schedule events, and post announcements.', color: 'green' },
    { icon: Star, title: 'Showcase Achievements', description: 'Track progress, celebrate milestones, and showcase projects to the campus.', color: 'orange' }
  ];
  
  const navItems = [
    { name: 'features', href: '#features', isExternal: false },
    { name: 'events', href: '#events', isExternal: false },
    { name: 'leaders', href: '#leaders', isExternal: false },
    { name: 'gallery', href: '/gallery', isExternal: true },
    { name: 'testimonials', href: '#testimonials', isExternal: false },
    { name: 'contact', href: '#contact', isExternal: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-background dark:via-background dark:to-black"
    >
      <header className="relative z-20 bg-foreground/80 dark:bg-foreground/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">Dr. AIT ClubHubs</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map(item => (
                item.isExternal ? (
                  <Link key={item.name} to={item.href} className="capitalize text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{item.name}</Link>
                ) : (
                  <a key={item.name} href={item.href} className="capitalize text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{item.name}</a>
                )
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroImageY }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=1200&fit=crop" alt="A modern university campus" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </motion.div>
        <div className="absolute inset-0 bg-blue-900/20 dark:bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="text-center text-white p-4">
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-xl" variants={itemVariants}>
              Build. Innovate. <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Lead.</span>
            </motion.h1>
            <motion.p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 drop-shadow-lg" variants={itemVariants}>
              The central hub for all student activities at Dr. AIT. Discover clubs, manage teams, and collaborate on groundbreaking projects.
            </motion.p>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl cursor-pointer" onClick={() => onRoleSelect('student')}>
                <Users className="h-8 w-8 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">I'm a Student</h3>
                <p>Explore clubs & join projects.</p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl cursor-pointer" onClick={() => onRoleSelect('leader')}>
                <Shield className="h-8 w-8 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">I'm a Club Leader</h3>
                <p>Manage your team & events.</p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl cursor-pointer" onClick={() => onRoleSelect('leader')}>
                <BookOpen className="h-8 w-8 text-orange-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Manage a Club</h3>
                <p>Edit details, logo & more.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="relative z-10 bg-foreground dark:bg-background">
        <section id="impact" className="py-16">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map(stat => {
              const Icon = iconMap[stat.icon] || Users;
              return (
                <motion.div key={stat.id} variants={itemVariants} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4`}><Icon className="h-6 w-6 text-white" /></div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    <AnimatedCounter to={stat.value} />
                    {stat.label === 'Student Engagement' ? '%' : '+'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section id="features" className="py-20 bg-gray-50 dark:bg-background/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need to <span className="text-primary">Excel</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Powerful tools for students and leaders to foster innovation and collaboration.</p>
            </motion.div>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map(feature => (
                <motion.div key={feature.title} variants={itemVariants} className="bg-foreground dark:bg-foreground p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className={`w-12 h-12 bg-${feature.color}-100 text-${feature.color}-600 rounded-lg flex items-center justify-center mb-4`}><feature.icon className="h-6 w-6" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <UpcomingEvents />

        <ClubLeadersShowcase />

        <section id="testimonials" className="py-20 bg-foreground dark:bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">From Our Own Innovators</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Hear what students and leaders have to say about their experience.</p>
            </motion.div>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(t => (
                <motion.div key={t.name} variants={itemVariants} className="bg-gray-50 dark:bg-foreground p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4"/>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{t.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">"{t.quote}"</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join a vibrant community of creators, builders, and leaders today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onRoleSelect('student')} className="px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-lg">Find Your Club</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onRoleSelect('leader')} className="px-8 py-3 border-2 border-white font-semibold rounded-lg">Manage Your Team</motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Dr. AIT ClubHubs</h3>
              <p className="text-sm">Dr. Ambedkar Institute of Technology</p>
              <p className="text-sm">Bengaluru, Karnataka, India</p>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold text-white">Contact Us</h4>
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4"/>
                    <a href="tel:+919886323678" className="hover:text-white">+91 98863 23678</a>
                </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://youtube.com/c/DrAmbedkarInstituteofTechnology" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Youtube /></a>
                <a href="https://facebook.com/DrAITOfficial" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Facebook /></a>
                <a href="https://twitter.com/DrAIT_official" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Twitter /></a>
                <a href="#" className="hover:text-white"><Instagram /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 Dr. AIT ClubHubs. All rights reserved.</p>
            <p className="mt-2 text-xs">Want to customize this platform? <a href="#" onClick={() => onRoleSelect('admin')} className="text-blue-400 hover:underline">Admin Login</a></p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
