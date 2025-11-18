import { useEffect, useRef, useState } from "react";

interface TopIntersectionResult {
  hitTop: boolean;
  isVisible: boolean;
  direction: "up" | "down" | null;
}

export function useChildTopIntersection(
  parentRef: React.RefObject<HTMLElement>,
  childRef: React.RefObject<HTMLElement>,
  threshold = 10,
  userScrolledUpCallback: () => void
): TopIntersectionResult {
  const [hitTop, setHitTop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  // Track last scroll position
  const lastScrollTop = useRef<number>(0);

    function reset() {
      setHitTop(false);
      setIsVisible(false);
      setDirection(null);
    }

  useEffect(() => {
    reset();
  }, [parentRef.current, childRef.current]);

  useEffect(() => {
    const parent = parentRef.current;
    const child = childRef.current;
    if (!parent || !child) return;

    const handleScroll = () => {
      const currentScrollTop = parent.scrollTop;

      // Determine scroll direction
      if (currentScrollTop > lastScrollTop.current) {
        setDirection("down");
      } else if (currentScrollTop < lastScrollTop.current) {
        userScrolledUpCallback();
        setDirection("up");
      }

      // Only check distance on DOWN scroll
      const isScrollingDown = currentScrollTop > lastScrollTop.current;
      lastScrollTop.current = currentScrollTop;

      if (!isScrollingDown) {
        return;
      }

      // Get positions using getBoundingClientRect
      const childRect = child.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      // Calculate distance from child top to parent top
      const distanceFromTop = childRect.top - parentRect.top;

      console.log('distanceFromTop:', distanceFromTop);

      // Check if child top is within threshold of parent top
      const hasHitTop = distanceFromTop <= threshold;

      setHitTop(hasHitTop);

      // Simple visibility check: is child intersecting with parent viewport?
      const childBottom = childRect.bottom;
      const parentBottom = parentRect.bottom;
      const isChildVisible = childRect.top < parentBottom && childBottom > parentRect.top;
      setIsVisible(isChildVisible);
    };

    parent.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      parent.removeEventListener("scroll", handleScroll);
    };
  }, [parentRef.current, childRef.current, threshold]);

  return { hitTop, isVisible, direction };
}
