import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';
import { TodoAttachment } from '../types/todo';
import { Button } from './ui/button';
import {
  PaperclipIcon,
  FileIcon,
  TrashIcon,
  FileTextIcon,
  ImageIcon,
  FileArchiveIcon,
  LoaderIcon,
  UploadCloudIcon,
  XCircleIcon
} from 'lucide-react';

interface TodoAttachmentsProps {
  todoId: string;
}

export const TodoAttachments: React.FC<TodoAttachmentsProps> = ({ todoId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // Query to fetch attachments
  const {
    data: attachments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['todoAttachments', todoId],
    queryFn: () => todoApi.getTodoAttachments(todoId),
  });

  // Mutation for uploading attachments
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      setIsUploading(true);
      return todoApi.uploadAttachment(todoId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoAttachments', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todoChanges', todoId] });
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
    }
  });

  // Mutation for deleting attachments
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => todoApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoAttachments', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todoChanges', todoId] });
    }
  });

  // Function to handle file selection via input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files[0]);
      // Clear the input value so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  // Functions to handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadMutation.mutate(e.dataTransfer.files[0]);
    }
  };

  // Function to get appropriate icon based on file type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileTextIcon className="h-5 w-5" />;
    } else if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) {
      return <FileArchiveIcon className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
        <span>Loading attachments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-sm py-1">
        Error loading attachments: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Attachments</h4>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button size="sm" variant="outline" asChild>
            <span>
              <PaperclipIcon className="h-4 w-4 mr-1" />
              Attach File
            </span>
          </Button>
        </label>
      </div>

      {/* File upload drop zone */}
      <div
        className={`border-2 border-dashed rounded-md p-4 transition-colors mb-3 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
          <UploadCloudIcon className="h-6 w-6 mb-1" />
          <p>Drag & drop files here or click "Attach File"</p>
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center py-2 mb-2 bg-muted rounded-md">
          <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Uploading file...</span>
        </div>
      )}

      {attachments && attachments.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((attachment: TodoAttachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between bg-muted p-2 rounded-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-background rounded-md mr-2">
                  {getFileIcon(attachment.mimeType)}
                </div>
                <div>
                  <a
                    href={todoApi.getAttachmentUrl(attachment.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {attachment.originalFilename}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(attachment.id)}
                disabled={deleteMutation.isPending}
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No attachments yet
        </div>
      )}
    </div>
  );
};
