import React from "react";
import { Loading } from "components/base";

interface IndexProps {
  page: any;
}

export const Lazy: React.FC<IndexProps> = ({ page }) => {
  const Component = React.useMemo(() => {
    return React.lazy(() => import(`../../../pages/${page}`));
  }, [page]);

  return (
    <React.Suspense fallback={<Loading />}>
      <Component />
    </React.Suspense>
  );
};
