import { useCallback, useRef } from 'react';

export const useNotificationSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    const play = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return;
            }
        }
        
        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Notification ping sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1500, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }, []);

    return play;
};
