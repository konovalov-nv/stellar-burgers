import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useSelector, useDispatch } from '../../services/store';
import {
  fetchPublicFeed,
  selectOrderData,
  selectOrderLoading
} from '../../services/features/order';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectOrderData);
  const isLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchPublicFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchPublicFeed())}
    />
  );
};
