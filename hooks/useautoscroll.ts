import { useRef, useEffect, useState } from "react";

interface ScrollOptions {
  threshold?: number;
}

export function useAutoscroll(deps: any[] = [], options: ScrollOptions = {}) {
  const { threshold = 100 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
    setShowNewMessagesButton(false);
  }, deps);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      setShowNewMessagesButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setShowNewMessagesButton(false);
    }
  };

  return { containerRef, showNewMessagesButton, scrollToBottom };
}
