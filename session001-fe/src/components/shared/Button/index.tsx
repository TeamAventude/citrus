import React from "react";
export interface IButtonProps {
  name: any;
  onClick?: (e: any) => void;
  icon?: any;
  type?: any;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "primaryLarge" | "small";
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  name,
  onClick,
  icon,
  type,
  disabled,
  variant = "primary",
  className = "",
}) => {
  const getVariantStyles = (variant: IButtonProps["variant"]) => {
    switch (variant) {
      case "primaryLarge":
        return {
          bg: "py-2 md:py-2.5 px-4 w-full text-white",
          imageSize: "h-4 w-4",
        };
      case "primary":
        return {
          bg: "py-2 md:py-2.5 px-4 text-white",
          imageSize: "h-4 w-4",
        };
      case "secondary":
        return {
          bg: "py-2 md:py-2 px-4 bg-white border border-theme text-theme",
        };

      case "small":
        return {
          bg: "py-2 px-2 text-white text-xs",
        };
      default:
        return null;
    }
  };
  const variantStyles = getVariantStyles(variant);
  return (
    <button
      type={type}
      className={`${variantStyles?.bg} bg-theme lg:px-6 text-p4 md:text-p3 w-full sm:w-fit font-bold uppercase rounded-md flex justify-center items-center h-9 gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="p-0">{name}</span>

      {icon && icon}
    </button>
  );
};
