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
  (props, ref) => {
    const formatValue = (v: number) =>
      props.prefix! + '' + (v / 10 ** props.decimals!).toFixed(props.decimals!);

    const parseValue = (v: string) =>
      v.includes(props.prefix!)
        ? parseFloat(v.split(props.prefix!)[1]) * 10 ** props.decimals!
        : !isNaN(parseFloat(v))
        ? parseFloat(v) * 10 ** props.decimals!
        : 0;

    const [internalValue, setInternalValue] = useState(
      formatValue(props.value),
    );
    const [isEditing, setIsEditing] = useState(false);

    return (
      <input
        {...props}
        type="text"
        ref={ref}
        value={isEditing ? internalValue : formatValue(props.value)}
        onFocus={() => {
          setInternalValue(formatValue(props.value));
          setIsEditing(true);
        }}
        onChange={e => setInternalValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          props.onValueChange(parseValue(internalValue));
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
