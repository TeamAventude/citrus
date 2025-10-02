import * as React from "react";

interface BadgeProps {
  status?: number | boolean | string | any;
  paperStatus?: number | boolean | string | any;
}

interface StatusInfo {
  text: string;
  name: string;
  bg: string;
}

export default function Badge({ status, paperStatus }: BadgeProps) {
  //
  const checkStatus = (
    status: BadgeProps["status"]
  ): StatusInfo | undefined => {
    if (status === "archived") {
      return {
        text: "text-[#ffffff]",
        name: "Archived",
        bg: "bg-[#b10303]",
      };
    } else if (status === "active") {
      return {
        text: "text-[#ffffff]",
        name: "Active",
        bg: "bg-[#076d0f]",
      };
    }
  };

  const statusInfo = checkStatus(status);

  return (
    <React.Fragment>
      <span
        className={`cursor-pointer text-[10px] inline-block w-[4rem] text-center rounded-[4px] px-2 py-0.5 ${statusInfo?.text} ${statusInfo?.bg}  `}
      >
        {statusInfo?.name}
      </span>
    </React.Fragment>
  );
}
