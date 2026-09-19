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

interface SpeechContextValue {
  selectedVoiceId: string | null;
  setSelectedVoiceId: (id: string | null) => Promise<void>;
  availableVoices: Speech.Voice[];
  voicesLoaded: boolean;
  refreshVoices: () => Promise<void>;
}

const SpeechContext = createContext<SpeechContextValue>({
  selectedVoiceId: null,
  setSelectedVoiceId: async () => {},
  availableVoices: [],
  voicesLoaded: false,
  refreshVoices: async () => {},
});

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const [selectedVoiceId, setVoiceId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(VOICE_KEY).then((stored) => {
      if (stored) setVoiceId(stored);
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
