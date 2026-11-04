import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '360px',
    }}>
      {toasts.map((toast) => {
        let borderColor = '#e5e7eb';
        let iconColor = '#6b7280';
        let Icon = Info;
        let bg = '#fff';

        if (toast.type === 'success') {
          borderColor = '#86efac';
          iconColor = '#16a34a';
          Icon = CheckCircle2;
          bg = '#f0fdf4';
        } else if (toast.type === 'error') {
          borderColor = '#fca5a5';
          iconColor = '#dc2626';
          Icon = AlertCircle;
          bg = '#fef2f2';
        }

        return (
          <div
            key={toast.id}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: bg,
              border: `1px solid ${borderColor}`,
              color: '#1a1a1a',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.87rem',
              animation: 'fadeInUp 0.25s ease',
            }}
          >
            <Icon size={17} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flexGrow: 1 }}>{toast.message}</span>
            <button
              onClick={() => onClose(toast.id)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px', lineHeight: 1 }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
