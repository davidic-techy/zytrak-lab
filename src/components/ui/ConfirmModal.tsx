import { Modal } from "./Modal";
import { Button } from "./Button";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: ()=>void;
  onCancel: ()=>void;
  children?: React.ReactNode; // <-- We added this to allow nested content!
}

export function ConfirmModal({ title, message, confirmLabel="Confirm", loading, onConfirm, onCancel, children }: Props) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 whitespace-pre-line">
          {message}
        </div>
        
        {/* We output the children (like the temperature input) right above the buttons */}
        {children} 
        
        <div className="flex gap-3">
          <Button loading={loading} onClick={onConfirm} className="flex-1">{confirmLabel}</Button>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}