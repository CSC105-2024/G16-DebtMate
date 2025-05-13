import { useState, useEffect } from 'react';

const useResponsiveLayout = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop); // Auto-open on desktop
    };

    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isDesktop, isMenuOpen, setIsMenuOpen };
};

export default useResponsiveLayout;