import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getOrdersThunk,
  selectStatus,
  selectUserOrders
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectUserOrders);
  const status = useSelector(selectStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersThunk());
    console.log(123);
  }, [dispatch]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
