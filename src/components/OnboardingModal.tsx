import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Compass, BarChart2, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        icon: User,
        title: "Manage Your Profile",
        description: "Keep your details up-to-date, showcase your interests, and add certifications you've earned.",
    },
    {
        icon: Compass,
        title: "Explore & Join Clubs",
        description: "Discover a wide range of clubs, see what they are up to, and send a request to join the ones that excite you.",
    },
    {
        icon: BarChart2,
        title: "Climb the Leaderboards",
        description: "Engage in club activities to earn points and see how you and your clubs rank against others on campus.",
    },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const Icon = steps[step].icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to ClubHubs!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Here’s a quick tour of your new dashboard.</p>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{steps[step].title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 min-h-[60px]">{steps[step].description}</p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex items-center justify-center space-x-2 my-8">
                                {steps.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-blue-500 w-4' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <button onClick={handlePrev} disabled={step === 0} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                                    <ArrowLeft />
                                </button>
                                {step === steps.length - 1 ? (
                                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Get Started
                                    </button>
                                ) : (
                                    <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Next
                                    </button>
                                )}
                                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingModal;
