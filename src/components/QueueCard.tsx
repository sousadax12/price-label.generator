'use client'
import { Queue } from "@/types/queue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Video, Volume2 } from "lucide-react";

interface QueueCardProps {
  queue: Queue;
  onEdit: (queue: Queue) => void;
  onDelete: (queueId: string) => void;
}

// Convert Android color integer to hex color
const androidColorToHex = (color: number): string => {
  const hex = (color >>> 0).toString(16).padStart(8, '0');
  return `#${hex.substring(2)}${hex.substring(0, 2)}`;
};

export default function QueueCard({ queue, onEdit, onDelete }: QueueCardProps) {
  const bgColor = androidColorToHex(queue.backgroundColor);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold mb-2">{queue.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-3xl font-bold px-4 py-2"
              >
                #{queue.number}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(queue);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                queue.id && onDelete(queue.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onEdit(queue)} className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: bgColor }}
              title={`Color: ${bgColor}`}
            />
            <span className="text-xs text-muted-foreground">Background</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Icon:</span>
            <Badge variant="outline">{queue.icon}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">Vol: {queue.videoVolume}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">Vol: {queue.soundVolume}%</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground truncate">
          <span className="font-medium">Velocity:</span> {queue.velocity}
        </div>

        {queue.videoURL && (
          <div className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Video:</span> {queue.videoURL}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
