import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text: string, skipAnimation: boolean = false) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing animation
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    
    // If there's no text or we should skip animation, just display it immediately
    if (!text || skipAnimation) {
      setDisplayText(text);
      return;
    }
    
    // Start typing animation
    setIsTyping(true);
    let i = 0;
    setDisplayText(''); // Start with empty string
    
    const typeNextChar = () => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
        typewriterRef.current = setTimeout(typeNextChar, 15);
      } else {
        setIsTyping(false);
        typewriterRef.current = null;
      }
    };
    
    // Call typeNextChar immediately to handle the first character
    typeNextChar();
    
    // Clean up on unmount or when text changes
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [text, skipAnimation]);

  return { displayText, isTyping };
};