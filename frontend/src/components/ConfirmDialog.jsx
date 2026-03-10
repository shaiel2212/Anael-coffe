import { useTranslation } from 'react-i18next';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-rustic-inkSoft mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-rustic-sand text-rustic-inkSoft hover:bg-rustic-sand/20 transition-colors font-medium">
          {t('common.cancel')}
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">
          {t('common.confirm')}
        </button>
      </div>
    </Modal>
  );
}
