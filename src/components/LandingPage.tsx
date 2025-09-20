import React from 'react';
import { Users, Shield, BookOpen, Star, ChevronRight, Sparkles, Trophy, Heart, Facebook, Youtube, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onRoleSelect: (role: 'student' | 'leader') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Discover Clubs',
      description: 'Browse through a diverse range of technical and cultural clubs to find your passion.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Collaborate & Innovate',
      description: 'Connect with peers on exciting projects, from building race cars to developing AI models.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Streamlined Management',
      description: 'Club leaders can efficiently manage members, schedule events, and post announcements.',
      color: 'green'
    },
    {
      icon: Star,
      title: 'Showcase Achievements',
      description: 'Track your club’s progress, celebrate milestones, and showcase your projects to the campus.',
      color: 'orange'
    }
  ];

  const stats = [
    { number: '40+', label: 'Technical & Cultural Clubs', icon: Trophy },
    { number: '5000+', label: 'Active Members', icon: Users },
    { number: '100+', label: 'Events Hosted Annually', icon: Sparkles },
    { number: '95%', label: 'Student Engagement', icon: Heart }
  ];

  const testimonials = [
    {
      name: 'Ajay',
      role: 'Head, Fashion Club',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
      quote: 'Dr. AIT ClubHubs helped us organize our annual fashion show flawlessly. From managing model auditions to coordinating with designers, the platform kept everything on track.'
    },
    {
      name: 'Riya',
      role: 'Lead Choreographer, Dance Club',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      quote: 'As a dance troupe, we have hectic practice schedules. The meeting scheduler on ClubHubs is a lifesaver! It helps us book practice halls and inform all members instantly.'
    },
    {
      name: 'Rohan',
      role: 'Lead Guitarist, Music Club',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      quote: "We used the announcements feature to promote our 'Battle of the Bands' event. The reach was amazing, and we had a full house! It's the best tool for campus outreach."
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-100 text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent">Dr. AIT ClubHubs</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#stats" className="text-gray-600 hover:text-gray-900 transition-colors">Impact</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Empowering the Innovators of Tomorrow
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build. Innovate. <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lead.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              The central hub for all student activities at Dr. AIT.
              Discover technical clubs, manage your team, and collaborate on groundbreaking projects.
            </p>

            {/* Role Selection Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                onClick={() => onRoleSelect('student')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Student</h3>
                  <p className="text-gray-600 mb-6">
                    Find project teams, join technical workshops, and explore your interests.
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold">
                    Explore Clubs <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                onClick={() => onRoleSelect('leader')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Club Leader</h3>
                  <p className="text-gray-600 mb-6">
                    Manage your team, organize tech talks, and track your club's progress.
                  </p>
                  <div className="flex items-center justify-center text-green-600 font-semibold">
                    Leader Portal <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop"
                alt="A modern university campus building"
                className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-blue-600">Excel</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools for students and club leaders to foster innovation and collaboration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = getColorClasses(feature.color);
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                >
                  <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Our Own Innovators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear what students and leaders have to say about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join a vibrant community of creators, builders, and leaders today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRoleSelect('student')}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                Find Your Club
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRoleSelect('leader')}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Manage Your Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white">Dr. AIT ClubHubs</h3>
              <p className="text-sm text-gray-400">Dr. Ambedkar Institute of Technology</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://www.youtube.com/channel/UCg_e_i-7Vq0aL9xYQ4qYQZw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Youtube className="h-6 w-6" /></a>
              <a href="https://www.facebook.com/drait.official/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="https://www.linkedin.com/school/dr-ambedkar-institute-of-technology-bangalore/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="h-6 w-6" /></a>
              <a href="https://www.instagram.com/drait.official/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>School clubs are all about growth—join to explore new interests, participate to build skills, and evolve into a better version of yourself while connecting with like-minded peers and creating lasting memories</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
