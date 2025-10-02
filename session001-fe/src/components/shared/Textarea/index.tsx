import React, { useMemo } from 'react';

export interface ITextareaProps {
  name: string;
  label?: string;
  rows?: number;
  type?: string;
  onChange?: any;
  values?: any;
  errors?: any;
  touches?: any;
  onBlur?: any;
  disabled?: boolean;
  autoFocus?: any;
  className?: any;
  placeholder?: any;
  onKeyDown?: any;
  defaultValue?: any;
  hidden?: any;
  min?: any;
  pattern?: any;
}

export function TextArea(props: ITextareaProps) {
  const isInvalid = useMemo(() => {
    return props?.touches?.[props?.name] && props?.errors?.[props?.name];
  }, [props?.touches, props?.errors, props?.name]);

  return (
    <div className='flex flex-col justify-start items-start gap-1'>
      <label
        htmlFor={props.name}
        className={`text-[11px] font-bold text-Black ${
          props?.hidden && 'hidden'
        }`}
      >
        {props.label}
      </label>

      <textarea
        disabled={props.disabled}
        className={
          props?.className
            ? props?.className
            : 'p-3 rounded-xl border focus:outline-none focus:border-gray-700 w-full text-xs'
        }
        id={props?.name}
        placeholder={props.placeholder}
        name={props?.name}
        onChange={props?.onChange}
        autoFocus={props?.autoFocus}
        onBlur={props?.onBlur}
        rows={props?.rows}
        value={props?.values?.[props?.name]}
        onKeyDown={props?.onKeyDown}
        defaultValue={props?.defaultValue}
      />

      {isInvalid ? (
        <div
          style={{ color: '#ef4444' }}
          className='font-bold text-[10px]'
        >
          {props?.errors[props?.name]}
        </div>
      ) : null}
    </div>
  );
}
