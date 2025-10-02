import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import * as routes from "../constants/routes";
import { Lazy } from "../components/base";
import { useSelector } from "react-redux";
import {
  isAuthorized as useAuthorized,
  permission as usePermission,
} from "store/auth/selector";
import { AppLayout } from "layouts";
import routeItems from "./routes";

export const ClientRouter: React.FC = () => {
  // const isAuthorized = useSelector(useAuthorized);
  const isAuthorized = true;

  const permission = useSelector(usePermission) || [];

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (!isAuthorized) {
      return <Navigate to={routes.LOGIN} replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.LOGIN} element={<Lazy page="Login" />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {routeItems.map((route, key) => {
            const isPermission = true;

            return (
              <Route
                path={route?.path}
                index
                key={key}
                element={
                  isPermission ? (
                    route?.component ? (
                      <Lazy page={route.component} />
                    ) : null
                  ) : (
                    <Lazy page="UnAuthorized" />
                  )
                }
              />
            );
          })}
        </Route>
        <Route path="*" element={<Lazy page="NotFound" />} />
      </Routes>
    </BrowserRouter>
  );
};
