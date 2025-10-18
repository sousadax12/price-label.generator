'use client'
import { Queue, QueueFormData } from "@/types/queue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QueueForm from "./QueueForm";

interface QueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queue?: Queue;
  onSubmit: (data: QueueFormData) => void;
  isLoading?: boolean;
}

export default function QueueDialog({
  open,
  onOpenChange,
  queue,
  onSubmit,
  isLoading = false
}: QueueDialogProps) {
  const isEditing = !!queue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Queue" : "Create New Queue"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the queue details below."
              : "Fill in the queue information to add a new queue to the system."
            }
          </DialogDescription>
        </DialogHeader>

        <QueueForm
          queue={queue}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
