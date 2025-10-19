'use client'
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Queue, QueueFormData } from "@/types/queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import QueueCard from "@/components/QueueCard";
import QueueDialog from "@/components/QueueDialog";
import getQueues from "@/firebase/firestore/getQueues";
import addData from "@/firebase/firestore/addData";
import updateData from "@/firebase/firestore/updateData";
import deleteData from "@/firebase/firestore/deleteData";

export default function QueuesPage() {
  const { user } = useAuthContext() as { user: any };
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<Queue | undefined>(undefined);
  const [deletingQueueId, setDeletingQueueId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadQueues = async () => {
    try {
      setLoading(true);
      setError(null);
      const { result, error } = await getQueues();

      if (error) {
        console.error("Error fetching queues:", error);
        setError("Failed to load queues. Please try again.");
      } else if (result) {
        setQueues(result);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadQueues();
    }
  }, [user]);

  const handleCreateQueue = async (formData: QueueFormData) => {
    try {
      setIsSubmitting(true);
      const newQueueId = `queue_${Date.now()}`;
      const { error } = await addData("queues", newQueueId, formData);

      if (error) {
        console.error("Error creating queue:", error);
        setError("Failed to create queue. Please try again.");
      } else {
        await loadQueues();
        setDialogOpen(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while creating the queue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQueue = async (formData: QueueFormData) => {
    if (!editingQueue?.id) return;

    try {
      setIsSubmitting(true);
      const { error } = await updateData("queues", editingQueue.id, formData);

      if (error) {
        console.error("Error updating queue:", error);
        setError("Failed to update queue. Please try again.");
      } else {
        await loadQueues();
        setDialogOpen(false);
        setEditingQueue(undefined);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while updating the queue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQueue = async () => {
    if (!deletingQueueId) return;

    try {
      setIsSubmitting(true);
      const { error } = await deleteData("queues", deletingQueueId);

      if (error) {
        console.error("Error deleting queue:", error);
        setError("Failed to delete queue. Please try again.");
      } else {
        await loadQueues();
        setDeleteDialogOpen(false);
        setDeletingQueueId(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while deleting the queue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingQueue(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (queue: Queue) => {
    setEditingQueue(queue);
    setDialogOpen(true);
  };

  const openDeleteDialog = (queueId: string) => {
    setDeletingQueueId(queueId);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: QueueFormData) => {
    if (editingQueue) {
      handleUpdateQueue(formData);
    } else {
      handleCreateQueue(formData);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Queue Management</h1>
          <p className="text-muted-foreground">
            Manage queue displays for Android TV app
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Queue
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content - Card Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading queues...</span>
        </div>
      ) : queues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No queues found. Click &ldquo;Add Queue&rdquo; to get started.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Queue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <QueueDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        queue={editingQueue}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Queue</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this queue? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQueue}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
