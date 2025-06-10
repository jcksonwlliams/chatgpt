import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    // iOS specific scroll handling
    const handleScroll = () => {
      // Check if we're in iOS
      if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
        // iOS needs a small timeout for proper scroll behavior
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    // Handle scroll on route change
    handleScroll();

    // Also handle scroll when iOS keyboard is dismissed
    const keyboardHideListener = () => {
      handleScroll();
    };

    // Add keyboard hide listener for iOS
    if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
      window.addEventListener('resize', keyboardHideListener);
    }

    // Cleanup
    return () => {
      if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
        window.removeEventListener('resize', keyboardHideListener);
      }
    };
  }, [location.pathname]);

  return null;
};
