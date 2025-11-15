'use client'
import { useState, useEffect } from "react";
import { Queue, QueueFormData } from "@/types/queue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_FORM_DATA: QueueFormData = {
  name: "",
  number: 0,
  icon: 0,
  backgroundColor: 4294922834,
  videoURL: "https://sicnot.live.impresa.pt/sicnot.m3u8",
  videoVolume: 0,
  soundVolume: 100,
  velocity: 50,
  hasNews: true,
};

interface QueueFormProps {
  queue?: Queue;
  onSubmit: (data: QueueFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function QueueForm({ queue, onSubmit, onCancel, isLoading = false }: QueueFormProps) {
  const [formData, setFormData] = useState<QueueFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof QueueFormData, string>>>({});

  useEffect(() => {
    if (queue) {
      setFormData({
        name: queue.name || "",
        number: queue.number || 0,
        icon: queue.icon || 0,
        backgroundColor: queue.backgroundColor || 4294922834,
        videoURL: queue.videoURL || "",
        videoVolume: queue.videoVolume || 0,
        soundVolume: queue.soundVolume || 100,
        velocity: queue.velocity || 50,
        hasNews: queue.hasNews ?? true,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setErrors({});
  }, [queue]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QueueFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Queue name is required";
    }

    if (formData.number < 0) {
      newErrors.number = "Number must be positive";
    }

    if (!formData.videoURL.trim()) {
      newErrors.videoURL = "Video URL is required";
    }

    if (formData.videoVolume < 0 || formData.videoVolume > 100) {
      newErrors.videoVolume = "Video volume must be between 0 and 100";
    }

    if (formData.soundVolume < 0 || formData.soundVolume > 100) {
      newErrors.soundVolume = "Sound volume must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleNumberChange = (field: keyof QueueFormData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTextChange = (field: keyof QueueFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Queue Name</Label>
        <Input
          id="name"
          placeholder="e.g., Talho, Peixaria"
          value={formData.name}
          onChange={(e) => handleTextChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Current Number</Label>
          <Input
            id="number"
            type="number"
            min="0"
            value={formData.number}
            onChange={(e) => handleNumberChange("number", e.target.value)}
            className={errors.number ? "border-red-500" : ""}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon Code</Label>
          <Input
            id="icon"
            type="number"
            value={formData.icon}
            onChange={(e) => handleNumberChange("icon", e.target.value)}
            className={errors.icon ? "border-red-500" : ""}
          />
          {errors.icon && (
            <p className="text-sm text-red-500">{errors.icon}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color (Decimal)</Label>
        <Input
          id="backgroundColor"
          type="number"
          value={formData.backgroundColor}
          onChange={(e) => handleNumberChange("backgroundColor", e.target.value)}
          className={errors.backgroundColor ? "border-red-500" : ""}
        />
        {errors.backgroundColor && (
          <p className="text-sm text-red-500">{errors.backgroundColor}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoURL">Video URL</Label>
        <Input
          id="videoURL"
          placeholder="e.g., https://example.com/video.m3u8"
          value={formData.videoURL}
          onChange={(e) => handleTextChange("videoURL", e.target.value)}
          className={errors.videoURL ? "border-red-500" : ""}
        />
        {errors.videoURL && (
          <p className="text-sm text-red-500">{errors.videoURL}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="videoVolume">Video Volume (0-100)</Label>
          <Input
            id="videoVolume"
            type="number"
            min="0"
            max="100"
            value={formData.videoVolume}
            onChange={(e) => handleNumberChange("videoVolume", e.target.value)}
            className={errors.videoVolume ? "border-red-500" : ""}
          />
          {errors.videoVolume && (
            <p className="text-sm text-red-500">{errors.videoVolume}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="soundVolume">Sound Volume (0-100)</Label>
          <Input
            id="soundVolume"
            type="number"
            min="0"
            max="100"
            value={formData.soundVolume}
            onChange={(e) => handleNumberChange("soundVolume", e.target.value)}
            className={errors.soundVolume ? "border-red-500" : ""}
          />
          {errors.soundVolume && (
            <p className="text-sm text-red-500">{errors.soundVolume}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="velocity">Velocity</Label>
          <Input
            id="velocity"
            type="number"
            value={formData.velocity}
            onChange={(e) => handleNumberChange("velocity", e.target.value)}
            className={errors.velocity ? "border-red-500" : ""}
          />
          {errors.velocity && (
            <p className="text-sm text-red-500">{errors.velocity}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasNews"
          checked={formData.hasNews}
          onCheckedChange={(checked) =>
            setFormData(prev => ({ ...prev, hasNews: checked === true }))
          }
        />
        <Label
          htmlFor="hasNews"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Enable News
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : queue ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
