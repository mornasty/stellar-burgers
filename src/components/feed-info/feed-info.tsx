import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectAllOrders,
  selectTotal,
  selectTotalToday
} from '../../services/slices/ordersSlice';

const getFeedsThunk = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(selectAllOrders);
  const total: number = useSelector(selectTotal);
  const totalToday: number = useSelector(selectTotalToday);
  const feed = { total, totalToday };

  const readyOrders = getFeedsThunk(orders, 'done');

  const pendingOrders = getFeedsThunk(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
