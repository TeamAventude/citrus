import React from "react";
import { Disclosure, Transition } from "@headlessui/react";

interface AccordionProps {
  title: string;
  content: React.ReactNode;
  color?: string;
  textColor?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  color = "bg-blue-500",
  textColor = "text-white",
}) => {
  return (
    <div className="w-full mt-4">
      <div className="mx-auto w-full rounded-md bg-white">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`flex text-xs font-bold w-full justify-between rounded-sm ${color} p-2 text-left ${textColor}`}
              >
                <span>{title}</span>
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-500 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-500 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 pt-2 pb-2 text-xs text-gray-500">
                  {content}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
