import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom'; // 🔥 Для редиректа

import { useDispatch, useSelector } from '../../services/store';
import { createOrder } from '../../services/features/order/order';
import { clearOrderModal } from '../../services/features/order/order';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const isAuth = useSelector((state) => state.user.isAuth);

  const constructorItems = useMemo(
    () => ({ bun, ingredients }),
    [bun, ingredients]
  );

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const orderModalDataForUI = useMemo((): TOrder | null => {
    if (!orderModalData) return null;
    return {
      _id: orderModalData._id,
      status: orderModalData.status,
      name: orderModalData.name,
      createdAt: orderModalData.createdAt,
      updatedAt: orderModalData.updatedAt,
      number: orderModalData.number,
      ingredients: []
    };
  }, [orderModalData]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', { replace: true });
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const handleCloseModal = () => {
    dispatch(clearOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalDataForUI}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
