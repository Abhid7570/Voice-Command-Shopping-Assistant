import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Custom hook for performance optimization with memoization
 */
export const usePerformance = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    lastRenderTime.current = performance.now();
  });

  /**
   * Get performance metrics
   */
  const getPerformanceMetrics = useCallback(() => ({
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current,
    timeSinceLastRender: performance.now() - lastRenderTime.current
  }), []);

  return {
    getPerformanceMetrics
  };
};

/**
 * Hook for debouncing function calls
 */
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]) as T;
};

/**
 * Hook for throttling function calls
 */
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  const inThrottle = useRef(false);
  
  return useCallback((...args: Parameters<T>) => {
    if (!inThrottle.current) {
      func(...args);
      inThrottle.current = true;
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
  }, [func, limit]) as T;
};

/**
 * Hook for optimizing list rendering with virtualization
 */
export const useVirtualization = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

/**
 * Hook for lazy loading components
 */
export const useLazyLoad = <T>(
  items: T[],
  pageSize: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentPage(prev => prev + 1);
    setIsLoading(false);
  }, [isLoading]);

  const loadedItems = useMemo(() => {
    return items.slice(0, currentPage * pageSize);
  }, [items, currentPage, pageSize]);

  const hasMore = loadedItems.length < items.length;

  return {
    loadedItems,
    hasMore,
    isLoading,
    loadMore
  };
};
