import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px'
    }}>
      {toasts.map((toast) => {
        let bg = '#1E140D';
        let border = 'var(--border-gold)';
        let Icon = Info;
        let iconColor = 'var(--accent-gold)';

        if (toast.type === 'success') {
          border = 'rgba(34, 197, 94, 0.5)';
          Icon = CheckCircle2;
          iconColor = '#4ade80';
        } else if (toast.type === 'error') {
          border = 'rgba(239, 68, 68, 0.5)';
          Icon = AlertCircle;
          iconColor = '#f87171';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: 'var(--text-cream)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.88rem'
            }}
          >
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flexGrow: 1 }}>{toast.message}</span>
            <button
              onClick={() => onClose(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
