import React, { useState, useEffect } from 'react';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string | number | undefined;
  onChange: (value: string) => void;
  textarea?: boolean;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({ 
  value: initialValue, 
  onChange, 
  textarea = false, 
  ...props 
}) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Check if value actually changed from prop to avoid redundant updates
      if (value !== (initialValue || '')) {
        onChange(String(value));
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value, initialValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  if (textarea) {
    return (
      <textarea
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        value={value}
        onChange={handleChange}
      />
    );
  }

  return (
    <input
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      value={value}
      onChange={handleChange}
    />
  );
};