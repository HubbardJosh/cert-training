import { useCallback, useEffect, useRef, useState } from "react";
import * as Speech from "expo-speech";
import { useSpeechContext } from "../context/SpeechContext";

export type SpeechState = "idle" | "playing" | "paused";

export function useSpeech() {
  const { selectedVoiceId, speechRate } = useSpeechContext();
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
    null,
  );
  const [state, setState] = useState<SpeechState>("idle");
  const stateRef = useRef<SpeechState>("idle");

  const updateState = (next: SpeechState) => {
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = useCallback(
    (index: number, text: string) => {
      Speech.stop();
      setActiveSectionIndex(index);
      updateState("playing");

      Speech.speak(text, {
        voice: selectedVoiceId ?? undefined,
        rate: speechRate,
        onDone: () => {
          setActiveSectionIndex(null);
          updateState("idle");
        },
        onStopped: () => {
          updateState("idle");
        },
        onError: () => {
          setActiveSectionIndex(null);
          updateState("idle");
        },
      });
    },
    [selectedVoiceId, speechRate],
  );

  const stop = useCallback(() => {
    Speech.stop();
    setActiveSectionIndex(null);
    updateState("idle");
  }, []);

  return { activeSectionIndex, state, speak, stop };
}
