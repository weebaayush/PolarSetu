import { useEffect, useState } from 'react';
import { useAppState } from '../state/store';

export default function Toast() {
  const { toast } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status">
      {toast?.msg}
    </div>
  );
}
