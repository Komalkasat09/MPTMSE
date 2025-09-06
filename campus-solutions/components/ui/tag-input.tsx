// /components/ui/tag-input.tsx

"use client";

import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              className="rounded-full hover:bg-muted-foreground/20 p-0.5"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add a tag and press Enter...'}
        />
        <Button type="button" variant="outline" onClick={addTag}>Add</Button>
      </div>
    </div>
  );
};