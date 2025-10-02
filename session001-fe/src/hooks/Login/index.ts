import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginRequested } from 'store/auth/authSlice';

export function useLogin() {
  const dispatch = useDispatch();

  const onLogin = useCallback(
    async (values: any, actions: any) => {
      values.userType = 0;
      actions.setSubmitting(true);
      await dispatch(loginRequested(values));

      setTimeout(() => {
        actions.setSubmitting(false);
      }, 1000);
    },
    [dispatch]
  );

  return { onLogin };
}
