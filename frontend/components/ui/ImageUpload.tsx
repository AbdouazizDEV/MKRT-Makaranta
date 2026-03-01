/**
 * Composant pour l'upload d'images
 */

import { useRef, useState, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label = 'Image' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg',
            'hover:border-[#F4A823] hover:text-[#F4A823] transition-colors'
          )}
        >
          <Upload className="w-5 h-5" />
          <span>{preview ? 'Changer l\'image' : 'Choisir une image'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
