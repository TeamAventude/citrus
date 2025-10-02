import * as React from "react";
import { NavLink } from "react-router-dom";
import { Forward } from "lucide-react";
interface IBreadCrumbProps {
  routes: { icon?: any; path: string; breadcrumb: string }[];
}

export function Breadcrumb(props: IBreadCrumbProps) {
  return (
    <div className="hidden lg:flex items-center bg-gray-50 w-fit rounded-md  p-2 gap-2">
      <NavLink to="/">
        <div className="flex items-center  transition gap-3">
          <span className="text-xs  font-medium text-black capitalize">
            Home
          </span>

          <Forward className="text-black w-5 h-5" />
        </div>
      </NavLink>

      {props?.routes?.map((item: any, key: number) => (
        <li className="flex items-center" key={key}>
          <NavLink to={item?.path}>
            <div className="flex gap-3 items-center transition">
              {item?.icon && item.icon}
              <span className="text-xs font-medium text-black capitalize">
                {window.innerWidth < 768
                  ? item?.breadcrumb?.slice(0, 3)
                  : item?.breadcrumb}
              </span>
              {key !== props.routes.length - 1 && (
                <Forward className="text-black w-5 h-5" />
              )}
            </div>
          </NavLink>
        </li>
      ))}
    </div>
  );
}
