export interface VoiceProvider {
  synthesize(text: string, lang: string, onEnd?: () => void): void;
  stop(): void;
}

export class WebSpeechProvider implements VoiceProvider {
  synthesize(text: string, lang: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map abstract languages to WebSpeech langs
    const langMap: Record<string, string> = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'hinglish': 'hi-IN', // Use hi-IN for hinglish so English words sound Indian and Hindi words sound perfect
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN'
    };
    
    const targetLang = langMap[lang] || 'hi-IN';
    utterance.lang = targetLang;
    
    const voices = window.speechSynthesis.getVoices();
    
    // Aggressively hunt for the most natural non-robotic voices available offline/built-in
    let voice = voices.find(v => v.lang === targetLang && v.name.includes('Google हिन्दी'));
    if (!voice) voice = voices.find(v => v.name.includes('Microsoft Swara') || v.name.includes('Microsoft Neerja'));
    if (!voice) voice = voices.find(v => v.lang === targetLang && v.name.includes('Google'));
    if (!voice) voice = voices.find(v => v.lang === targetLang && v.name.includes('Natural'));
    if (!voice) voice = voices.find(v => v.lang === targetLang);
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' && v.name.includes('Google'));
                  
    if (voice) utterance.voice = voice;
    
    utterance.rate = 0.95; // Slightly slower for more natural pacing
    utterance.pitch = 1.0;
    
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

// Stub for Sarvam Cloud API (Backend Proxy)
export class SarvamCloudProvider implements VoiceProvider {
  synthesize(text: string, lang: string, onEnd?: () => void): void {
    // In a real implementation, this streams from /api/voice/tts
    // For unlimited token-free mode without an API key, we fallback.
    console.log(`[Sarvam Cloud TTS] requested for: ${text} in ${lang}. Falling back to WebSpeech for token-free mode.`);
    const fallback = new WebSpeechProvider();
    fallback.synthesize(text, lang, onEnd);
  }

  stop(): void {
    const fallback = new WebSpeechProvider();
    fallback.stop();
  }
}

export class VoiceProviderFactory {
  static getProvider(): VoiceProvider {
    // If SARVAM_API_KEY is available in backend, use SarvamCloudProvider
    // Defaulting to token-free WebSpeechProvider for unlimited local use
    return new WebSpeechProvider();
  }
}
