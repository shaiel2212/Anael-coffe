import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-rustic-ink/40" onClick={onClose} />
      <div className={`relative rustic-card w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-rustic-sand/40">
          <h2 className="text-lg font-heading font-semibold text-rustic-ink">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-rustic-sand/30 rounded-lg transition-colors text-rustic-inkSoft">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
