import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

const VOICE_KEY = "@speech_voice_id";
const RATE_KEY = "@speech_rate";

export const SPEECH_RATES = [
  { label: "0.5×", value: 0.5 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1.0 },
  { label: "1.25×", value: 1.25 },
  { label: "1.5×", value: 1.5 },
];

export const DEFAULT_RATE = 1.0;

interface SpeechContextValue {
  selectedVoiceId: string | null;
  setSelectedVoiceId: (id: string | null) => Promise<void>;
  speechRate: number;
  setSpeechRate: (rate: number) => Promise<void>;
  availableVoices: Speech.Voice[];
  voicesLoaded: boolean;
  refreshVoices: () => Promise<void>;
}

const SpeechContext = createContext<SpeechContextValue>({
  selectedVoiceId: null,
  setSelectedVoiceId: async () => {},
  speechRate: DEFAULT_RATE,
  setSpeechRate: async () => {},
  availableVoices: [],
  voicesLoaded: false,
  refreshVoices: async () => {},
});

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const [selectedVoiceId, setVoiceId] = useState<string | null>(null);
  const [speechRate, setRate] = useState(DEFAULT_RATE);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(VOICE_KEY).then((stored) => {
      if (stored) setVoiceId(stored);
    });
    AsyncStorage.getItem(RATE_KEY).then((stored) => {
      if (stored) setRate(parseFloat(stored));
    });

    Speech.getAvailableVoicesAsync().then((voices) => {
      setAvailableVoices(voices);
      setVoicesLoaded(true);
    });
  }, []);

  const setSelectedVoiceId = useCallback(async (id: string | null) => {
    setVoiceId(id);
    if (id === null) {
      await AsyncStorage.removeItem(VOICE_KEY);
    } else {
      await AsyncStorage.setItem(VOICE_KEY, id);
    }
  }, []);

  const setSpeechRate = useCallback(async (rate: number) => {
    setRate(rate);
    await AsyncStorage.setItem(RATE_KEY, String(rate));
  }, []);

  const refreshVoices = useCallback(async () => {
    setVoicesLoaded(false);
    const voices = await Speech.getAvailableVoicesAsync();
    setAvailableVoices(voices);
    setVoicesLoaded(true);
  }, []);

  return (
    <SpeechContext.Provider
      value={{
        selectedVoiceId,
        setSelectedVoiceId,
        speechRate,
        setSpeechRate,
        availableVoices,
        voicesLoaded,
        refreshVoices,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechContext() {
  return useContext(SpeechContext);
}
