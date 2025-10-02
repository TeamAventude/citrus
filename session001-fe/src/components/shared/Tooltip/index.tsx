import React, { useState } from 'react';

export interface ITooltipProps {
  text?: string;
  children?: React.ReactNode;
}
export const Tooltip: React.FC<ITooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className='relative flex items-center cursor-pointer'
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className='absolute whitespace-nowrap cursor-pointer bottom-full w-fit p-1 bg-gray-100 text-black text-[10px] rounded-sm'>
          {text}
        </div>
      )}
    </div>
  );
};
