import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts(onToggleHelper: () => void) {
  const navigate = useNavigate();

  useEffect(() => {
    let keysPressed: string[] = [];
    let timeoutId: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut inputs if focus is inside input elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      keysPressed.push(e.key.toLowerCase());

      // Reset keyboard buffer after 1 second
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        keysPressed = [];
      }, 1000);

      const sequence = keysPressed.join('');

      // Go commands
      if (sequence === 'gd') { navigate('/'); keysPressed = []; }
      else if (sequence === 'gm') { navigate('/markets'); keysPressed = []; }
      else if (sequence === 'gp') { navigate('/portfolio'); keysPressed = []; }
      else if (sequence === 'gt') { navigate('/technical'); keysPressed = []; }
      else if (sequence === 'go') { navigate('/options'); keysPressed = []; }
      else if (sequence === 'ga') { navigate('/signals'); keysPressed = []; }
      else if (sequence === 'gw') { navigate('/watchlist'); keysPressed = []; }
      else if (sequence === 'gn') { navigate('/news'); keysPressed = []; }
      else if (sequence === 'gs') { navigate('/settings'); keysPressed = []; }
      else if (e.key === '?') {
        e.preventDefault();
        onToggleHelper();
        keysPressed = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, onToggleHelper]);
}
