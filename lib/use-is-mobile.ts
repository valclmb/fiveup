"use client";
import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true); // Commencer par true pour mobile par défaut

  useEffect(() => {
    const checkMobile = () => {
      // Vérifier la largeur ET la présence de touch (plus fiable pour les vrais mobiles)
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(width < 768 || (width < 1024 && hasTouch));
    };

    // Vérifier immédiatement
    checkMobile();

    // Écouter les changements de taille
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
};
