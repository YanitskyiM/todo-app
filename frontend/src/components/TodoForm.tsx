import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Todo as TodoType } from '../types/todo';
import { Plus, Save, X, PaperclipIcon, ImageIcon, FileIcon, XCircleIcon } from 'lucide-react';
import { todoApi } from '../services/todoApi';

interface TodoFormProps {
  onSubmit: (title: string, file?: File) => void;
  todo?: TodoType | null;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, todo, onCancel }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
    }
  }, [todo]);

  useEffect(() => {
    // Clean up preview URL when component unmounts or file changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), file || undefined);
      setTitle('');
      setFile(null);
      setPreview(null);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setFile(null);
    setPreview(null);
    onCancel?.();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="sticky top-0 bg-background pt-2 pb-4 z-10 border-b mb-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={todo ? "Update todo..." : "Add a new todo..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow"
            required
          />
          <Button type="submit" className="min-w-[80px]">
            {todo ? <Save className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {todo ? 'Save' : 'Add'}
          </Button>
          {todo && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>

        {/* File attachment section */}
        <div className="flex justify-between items-center">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center"
            >
              <PaperclipIcon className="h-3 w-3 mr-1" />
              Attach File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 bg-muted p-1 px-2 rounded-md">
              {file.type.startsWith('image/') ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <FileIcon className="h-3 w-3" />
              )}
              <span className="text-xs truncate max-w-[150px]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <XCircleIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview for image files */}
        {preview && (
          <div className="relative border rounded-md overflow-hidden">
            <img src={preview} alt="Preview" className="max-h-40 mx-auto" />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
