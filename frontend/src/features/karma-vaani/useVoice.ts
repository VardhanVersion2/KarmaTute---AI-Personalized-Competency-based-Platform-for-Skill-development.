import { useRef, useState } from "react";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;

  onerror:
    | ((event: {
        error: string;
      }) => void)
    | null;

  onresult:
    | ((event: {
        resultIndex: number;
        results: any;
      }) => void)
    | null;
};

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionInstance;

type VoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function useVoice() {
  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const [isListening, setIsListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const [error, setError] =
    useState("");

  const startListening = () => {
    setError("");
    setTranscript("");

    const voiceWindow =
      window as VoiceWindow;

    const SpeechRecognition =
      voiceWindow.SpeechRecognition ||
      voiceWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    try {
      const recognition =
        new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;

      // Indian English.
      // Later we can dynamically switch this
      // between en-IN / hi-IN / etc.
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };

      recognition.onresult = (
        event
      ) => {
        let combinedTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result && result[0]) {
            combinedTranscript += result[0].transcript + " ";
          }
        }

        setTranscript(
          combinedTranscript.trim()
        );
      };

      recognition.onerror = (
        event
      ) => {
        console.error(
          "Speech recognition error:",
          event.error
        );

        setIsListening(false);

        switch (event.error) {
          case "not-allowed":
            setError(
              "Microphone permission was denied. Please allow microphone access and try again."
            );
            break;

          case "audio-capture":
            setError(
              "No microphone was detected on this device."
            );
            break;

          case "network":
            setError(
              "Speech recognition requires a network connection in this browser."
            );
            break;

          case "no-speech":
          default:
            // Quietly ignore "no-speech" or generic errors so it doesn't loop
            // saying "I couldn't understand you" indefinitely in continuous mode.
            break;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current =
        recognition;

      recognition.start();
    } catch (err) {
      console.error(
        "Unable to start speech recognition:",
        err
      );

      setIsListening(false);

      setError(
        "Unable to start voice recognition. Please try again."
      );
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error(
        "Unable to stop recognition:",
        err
      );
    }

    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}