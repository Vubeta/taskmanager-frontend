import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { Fragment } from "react";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
                                         open,
                                         title = "Xác nhận",
                                         message = "Bạn có chắc muốn thực hiện hành động này?",
                                         onConfirm,
                                         onCancel,
                                     }: ConfirmModalProps) {
    return (
        <Dialog open={open} onClose={onCancel} as={Fragment}>
            <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <DialogPanel className="bg-white rounded-lg p-6 shadow-xl w-80">
                    <DialogTitle className="text-lg font-semibold mb-2">
                        {title}
                    </DialogTitle>
                    <Description className="text-gray-600 mb-4">
                        {message}
                    </Description>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Xóa
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
