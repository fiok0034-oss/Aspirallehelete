import { useState, useEffect, useRef, useCallback } from 'react';
import { BOOK_CHAPTERS } from '../data/bookData';

export type NarrationMode = 'excerpt' | 'full';

export interface SpeechNarrationState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  activeChapterIndex: number | null;
  currentParagraphIndex: number;
  totalParagraphs: number;
  mode: NarrationMode;
  rate: number;
  pitch: number;
  selectedVoiceURI: string;
  availableVoices: SpeechSynthesisVoice[];
  activeText: string;
}

export const useSpeechNarration = (
  onParagraphChange?: (chapterIndex: number, paragraphIndex: number) => void
) => {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const [totalParagraphs, setTotalParagraphs] = useState<number>(0);
  const [mode, setMode] = useState<NarrationMode>('excerpt');
  const [rate, setRate] = useState<number>(0.92); // atmospheric slightly slower pace
  const [pitch, setPitch] = useState<number>(0.95);
  const [activeText, setActiveText] = useState<string>('');

  const currentParagraphIndexRef = useRef(0);
  const activeChapterIndexRef = useRef<number | null>(null);
  const modeRef = useRef<NarrationMode>('excerpt');
  const queueRef = useRef<{ title: string; paragraphs: string[]; maxCount: number }>({
    title: '',
    paragraphs: [],
    maxCount: 0,
  });

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);

        // Find Hungarian voice if available, or high quality English/default
        const huVoice = voices.find(
          (v) => v.lang.startsWith('hu') || v.name.toLowerCase().includes('hungarian')
        );
        const naturalVoice = voices.find(
          (v) => v.lang.startsWith('hu') || v.name.toLowerCase().includes('natural')
        );

        setSelectedVoiceURI((prev) => {
          if (prev && voices.some((v) => v.voiceURI === prev)) return prev;
          return huVoice ? huVoice.voiceURI : naturalVoice ? naturalVoice.voiceURI : voices[0]?.voiceURI || '';
        });
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Sync refs
  useEffect(() => {
    currentParagraphIndexRef.current = currentParagraphIndex;
  }, [currentParagraphIndex]);

  useEffect(() => {
    activeChapterIndexRef.current = activeChapterIndex;
  }, [activeChapterIndex]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const speakCurrentIndex = useCallback(
    (index: number) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();

      const q = queueRef.current;
      if (!q.paragraphs || index >= q.maxCount || index >= q.paragraphs.length) {
        // Finished queue
        setIsPlaying(false);
        setIsPaused(false);
        setActiveText('');
        return;
      }

      const textToSpeak = q.paragraphs[index];
      if (!textToSpeak || !textToSpeak.trim()) {
        // Skip empty paragraph
        if (index + 1 < q.maxCount) {
          speakCurrentIndex(index + 1);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Select voice
      const currentVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (currentVoice) {
        utterance.voice = currentVoice;
        utterance.lang = currentVoice.lang;
      } else {
        utterance.lang = 'hu-HU';
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentParagraphIndex(index);
        setActiveText(textToSpeak);
        if (activeChapterIndexRef.current !== null && onParagraphChange) {
          onParagraphChange(activeChapterIndexRef.current, index);
        }
      };

      utterance.onend = () => {
        const nextIdx = index + 1;
        if (nextIdx < queueRef.current.maxCount && nextIdx < queueRef.current.paragraphs.length) {
          speakCurrentIndex(nextIdx);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setActiveText('');
        }
      };

      utterance.onerror = (e) => {
        // Ignore error caused by intentional cancel
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        console.warn('Speech synthesis error:', e);
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, isSupported, onParagraphChange, pitch, rate, selectedVoiceURI]
  );

  const startExcerpt = useCallback(
    (chapterIndex: number, startParagraphIdx: number = 0, targetMode: NarrationMode = 'excerpt') => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();

      const chapter = BOOK_CHAPTERS[chapterIndex];
      if (!chapter) return;

      const rawParas = chapter.paragraphs;
      // In excerpt mode, narrate first 3 key paragraphs (or from startParagraphIdx up to +3)
      const maxCount = targetMode === 'excerpt' ? Math.min(rawParas.length, Math.max(3, startParagraphIdx + 3)) : rawParas.length;

      queueRef.current = {
        title: `${chapter.title}. ${chapter.subtitle ? chapter.subtitle + '.' : ''}`,
        paragraphs: rawParas,
        maxCount,
      };

      setMode(targetMode);
      setActiveChapterIndex(chapterIndex);
      setTotalParagraphs(maxCount);
      setCurrentParagraphIndex(startParagraphIdx);
      setIsPlaying(true);
      setIsPaused(false);

      speakCurrentIndex(startParagraphIdx);
    },
    [isSupported, speakCurrentIndex]
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else if (activeChapterIndex !== null) {
      speakCurrentIndex(currentParagraphIndexRef.current);
    }
  }, [activeChapterIndex, isSupported, speakCurrentIndex]);

  const togglePlayPause = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isPlaying) {
      pause();
    }
  }, [isPaused, isPlaying, pause, resume]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveText('');
  }, [isSupported]);

  const nextParagraph = useCallback(() => {
    const nextIdx = currentParagraphIndexRef.current + 1;
    if (nextIdx < queueRef.current.maxCount) {
      speakCurrentIndex(nextIdx);
    } else {
      stop();
    }
  }, [speakCurrentIndex, stop]);

  const prevParagraph = useCallback(() => {
    const prevIdx = Math.max(0, currentParagraphIndexRef.current - 1);
    speakCurrentIndex(prevIdx);
  }, [speakCurrentIndex]);

  const handleSetRate = useCallback(
    (newRate: number) => {
      setRate(newRate);
      if (isPlaying && !isPaused) {
        speakCurrentIndex(currentParagraphIndexRef.current);
      }
    },
    [isPaused, isPlaying, speakCurrentIndex]
  );

  const handleSetPitch = useCallback(
    (newPitch: number) => {
      setPitch(newPitch);
      if (isPlaying && !isPaused) {
        speakCurrentIndex(currentParagraphIndexRef.current);
      }
    },
    [isPaused, isPlaying, speakCurrentIndex]
  );

  const handleSetVoiceURI = useCallback(
    (uri: string) => {
      setSelectedVoiceURI(uri);
      if (isPlaying && !isPaused) {
        speakCurrentIndex(currentParagraphIndexRef.current);
      }
    },
    [isPaused, isPlaying, speakCurrentIndex]
  );

  return {
    isSupported,
    isPlaying,
    isPaused,
    activeChapterIndex,
    currentParagraphIndex,
    totalParagraphs,
    mode,
    rate,
    pitch,
    selectedVoiceURI,
    availableVoices,
    activeText,
    startExcerpt,
    togglePlayPause,
    stop,
    nextParagraph,
    prevParagraph,
    setRate: handleSetRate,
    setPitch: handleSetPitch,
    setVoiceURI: handleSetVoiceURI,
    setMode,
  };
};
