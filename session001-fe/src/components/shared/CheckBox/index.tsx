import React from "react";

export interface CheckboxProps {
  name: string;
  values: any;
  label: string;
  description?: string;
  className?: string;
  checked?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckBox: React.FC<CheckboxProps> = ({
  name,
  label,
  description,
  onChange,
  className,
  values,
  checked,
}) => {
  return (
    <div
      className={
        className ? className : `flex gap-4 items-start w-fit ${className}`
      }
    >
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          onChange={onChange}
          checked={values[name]}
          className={
            className
              ? className
              : `focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-200 flex gap-2 rounded-xl accent-[#0075d4] cursor-pointer ${className}`
          }
        />
      </div>
      <div className="text-sm">
        <label
          htmlFor={name}
          className="block text-[12px] font-bold text-[#8E8E8E]"
        >
          {label}
        </label>
        {description && <p className="text-[#8E8E8E]">{description}</p>}
      </div>
    </div>
  );
};
