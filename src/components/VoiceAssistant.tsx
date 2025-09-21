import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
    const [isListening, setIsListening] = useState(false);

    // Note: Full voice command functionality would require the Web Speech API 
    // and potentially a backend AI service. This is a UI placeholder.
    const handleToggleListening = () => {
        setIsListening(prev => !prev);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200]">
            <motion.button
                onClick={handleToggleListening}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isListening && (
                    <motion.div
                        className="absolute inset-0 bg-blue-400 rounded-full"
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
                <Mic className="h-8 w-8 z-10" />
            </motion.button>
        </div>
    );
};

export default VoiceAssistant;
