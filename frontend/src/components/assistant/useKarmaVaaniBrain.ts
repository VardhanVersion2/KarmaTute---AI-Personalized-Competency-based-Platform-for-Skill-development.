import { useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { VoiceProviderFactory } from '../../features/karma-vaani/providers/VoiceProvider';

export function useKarmaVaaniBrain() {
  const { currentPage, setCurrentPage, setUserRole, isAdmin, setSoundEnabled } = useApp();
  
  const provider = VoiceProviderFactory.getProvider();

  const speak = useCallback((text: string, lang: string = 'hinglish', callback?: () => void) => {
    provider.synthesize(text, lang, callback);
  }, [provider]);

  const processCommand = useCallback((transcript: string): { response: string, lang: string } => {
    const text = transcript.toLowerCase();
    
    // Detect basic language intent (Fallback to hinglish)
    let detectedLang = 'hinglish';
    if (text.includes('hindi')) detectedLang = 'hi';
    if (text.includes('english')) detectedLang = 'en';
    if (text.includes('bengali') || text.includes('bangla')) detectedLang = 'bn';
    if (text.includes('tamil')) detectedLang = 'ta';
    if (text.includes('telugu')) detectedLang = 'te';
    if (text.includes('marathi')) detectedLang = 'mr';

    const match = (keywords: string[]) => keywords.some(kw => text.includes(kw));

    // DEEP-DIVE PLATFORM KNOWLEDGE (Intercepts before generic navigation)
    if ((text.includes('execute') || text.includes('execution')) && (text.includes('kya') || text.includes('what') || text.includes('dabane se') || text.includes('kaise'))) {
      return { 
        response: "When you press the Execution button, you are taken to the Execution Lab. Wahan aapko ek real-world practical scenario diya jata hai jisse aapka actual skill measure hota hai. Ye theory nahi, practical proof hai. Kaho toh main open karoon?", 
        lang: detectedLang 
      };
    }

    if (text.includes('data chamber') && (text.includes('file') || text.includes('kaise') || text.includes('kya') || text.includes('how') || text.includes('explain'))) {
      return { 
        response: "Bohot achha sawal! Data Chamber ek highly secure vault hai. Jab aap koi skill Execution Lab me verify karte ho, toh uska cryptographic proof automatic Karma DNA ban kar seedha Data Chamber me lock ho jata hai. Ye 100% tamper-proof hai.", 
        lang: detectedLang 
      };
    }

    if ((text.includes('dna') || text.includes('token')) && (text.includes('kya') || text.includes('what') || text.includes('explain') || text.includes('saari cheeze'))) {
      return { 
        response: "Karma DNA aapka unique digital fingerprint hai. Jaise physical DNA unique hota hai, waise hi isme aapke saare verified skills, competencies, aur training history ek immutable ledger mein safe rehti hai. Koi iske saath chhed-chhad nahi kar sakta.", 
        lang: detectedLang 
      };
    }

    if (match(['mospi', 'ministry', 'statistics', 'nssta', 'framework'])) {
      return { 
        response: "MoSPI is the Ministry of Statistics and Programme Implementation. Ye platform NSSTA framework ko completely follow karta hai, taaki government officers exact competency standards meet kar sakein. I am built strictly for this official purpose.", 
        lang: detectedLang 
      };
    }

    // CONTEXT-AWARE KNOWLEDGE
    if (match(['recommendation', 'kyun', 'why this', 'gap kya hai', 'mera gap'])) {
      if (currentPage === 'command-center') {
        return { response: "Aapka current level target se thoda neeche hai. Isliye system ne aapko ye Next Best Action recommend kiya hai, taki gap bridge ho sake.", lang: detectedLang };
      }
      if (currentPage === 'skill-intelligence') {
        return { response: "Yahan aap dekh sakte hain ki official benchmarks ke basis par aapka score kya hai. Har gap ek verified rule par based hai.", lang: detectedLang };
      }
      if (currentPage === 'execution-lab') {
        return { response: "Execution Lab mein low confidence hone par assessment seedha fail nahi hota, balki ek human supervisor ko review ke liye bheja jata hai. Ye government standards ke liye zaroori hai.", lang: detectedLang };
      }
      return { response: "Chaliye pehle aapka competency gap dekhte hain. Aap Skill Intelligence ya Command Center check kar sakte hain.", lang: detectedLang };
    }

    // NAVIGATION
    if (match(['execution', 'execute', 'lab', 'assessment', 'test', 'exam', 'evaluate', 'practical', 'mera test', 'paper'])) {
      setCurrentPage('execution-lab');
      return { response: "Theek hai, chaliye Execution Lab chalte hain. Yahan aap apna practical task perform kar sakte hain.", lang: detectedLang };
    }

    if (match(['skill', 'intelligence', 'competency', 'metrics', 'score', 'capability', 'performance', 'radar'])) {
      setCurrentPage('skill-intelligence');
      return { response: "Opening Skill Intelligence. Ab dekhiye yahan aap apni current competency scores dekh sakte hain.", lang: detectedLang };
    }

    if (match(['data', 'chamber', 'dna', 'export', 'download', 'save', 'karmadna'])) {
      setCurrentPage('data-chamber');
      return { response: "Data Chamber open ho gaya hai. Yahan se aap apni profile ka Karma DNA export kar sakte hain.", lang: detectedLang };
    }

    if (match(['growth', 'proof', 'certificate', 'ledger', 'history', 'record'])) {
      setCurrentPage('growth-proof');
      return { response: "Growth and Proof section mein aapka verified ledger aur certificate available hai.", lang: detectedLang };
    }

    if (match(['command center', 'home', 'dashboard', 'wapas', 'main menu', 'back'])) {
      setCurrentPage('command-center');
      return { response: "Command Center par wapas aagaye hain. Yahan aapka next step highlighted hai.", lang: detectedLang };
    }

    // CONVERSATIONAL & GENERAL KNOWLEDGE (A to Z)
    if (match(['what is karma', 'about karma', 'platform kya hai', 'tell me about'])) {
      return { response: "KarmaTute is the official National Competency Intelligence Platform for MoSPI. It tracks skills, execution evidence, and competency gaps securely on a blockchain-inspired ledger.", lang: detectedLang };
    }
    
    if (match(['mospi', 'ministry', 'statistics', 'nssta', 'framework'])) {
      return { response: "MoSPI is the Ministry of Statistics and Programme Implementation. This platform complies with the NSSTA framework to ensure government officers meet exact competency standards.", lang: detectedLang };
    }
    
    if (match(['how to use', 'kaise use', 'what to do', 'guide'])) {
      return { response: "Start at the Command Center to see your Next Best Action. Perform practical tasks in the Execution Lab, and check your overall progress in Skill Intelligence.", lang: detectedLang };
    }

    if (match(['dna token', 'karmadna token', 'token kya hai'])) {
      return { response: "Your Karma DNA Token is a unique cryptographic signature. It securely links all your assessments and verified skills directly to your identity.", lang: detectedLang };
    }

    if (match(['thank you', 'thanks', 'shukriya', 'dhanyawad'])) {
      return { response: "You're very welcome! Main hamesha aapki madad ke liye yahan hoon. Let me know if you need anything else.", lang: detectedLang };
    }

    if (match(['hello', 'hi', 'namaste', 'hey'])) {
      return { response: "Namaste! Main Karma Vaani hoon. Main aapko is platform par A-to-Z kisi bhi cheez mein guide kar sakti hoon.", lang: detectedLang };
    }

    if (match(['who are you', 'tum kaun ho', 'tumhara naam', 'kaun bol raha hai'])) {
      return { response: "I am Karma Vaani, your AI Helping Hand. Main yahan aapki navigation aur queries me madad karne ke liye hoon.", lang: detectedLang };
    }

    if (match(['admin', 'workforce', 'manager', 'boss'])) {
      if (!isAdmin) setUserRole('ROLE_ADMIN');
      setCurrentPage('admin');
      return { response: "Admin view me switch ho gaya hai. Yahan aap workforce intelligence monitor kar sakte hain.", lang: detectedLang };
    }
    
    if (text.includes('learner') || text.includes('student') || match(['employee', 'user'])) {
      if (isAdmin) setUserRole('ROLE_LEARNER');
      setCurrentPage('command-center');
      return { response: "Aap wapas learner mode mein hain.", lang: detectedLang };
    }

    // CATCH ALL
    return { response: "I'm sorry, I don't have information on that specific topic yet. Please ask about the platform, navigation, KarmaDNA, or your next best action.", lang: detectedLang };
  }, [currentPage, setCurrentPage, setUserRole, isAdmin]);

  return { speak, stop: provider.stop, processCommand };
}
