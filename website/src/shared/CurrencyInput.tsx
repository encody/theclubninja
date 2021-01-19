import React, { forwardRef, useState } from 'react';

interface CurrencyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  decimals?: number;
  prefix?: string;
  step?: number;
  onValueChange: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ prefix, decimals, step, value, onValueChange, ...props }, ref) => {
    const formatValue = (v: number) =>
      prefix! + '' + (v / 10 ** decimals!).toFixed(decimals!);

    const parseValue = (v: string) =>
      v.includes(prefix!)
        ? parseFloat(v.split(prefix!)[1]) * 10 ** decimals!
        : !isNaN(parseFloat(v))
        ? parseFloat(v) * 10 ** decimals!
        : 0;

    const [internalValue, setInternalValue] = useState(formatValue(value));
    const [isEditing, setIsEditing] = useState(false);

    return (
      <input
        {...props}
        type="text"
        ref={ref}
        value={isEditing ? internalValue : formatValue(value)}
        onFocus={() => {
          setInternalValue(formatValue(value));
          setIsEditing(true);
        }}
        onChange={e => setInternalValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          onValueChange(parseValue(internalValue));
        }}
      />
    );
  },
);

CurrencyInput.defaultProps = {
  prefix: '$',
  decimals: 2,
  step: 1,
};
