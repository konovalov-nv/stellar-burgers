import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор*/}
          <Link
            to='/'
            className={`${styles.link} ${isActive('/') ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>

          {/* Лента заказов */}
          <Link
            to='/feed'
            className={`${styles.link} ${isActive('/feed') ? styles.link_active : ''}`}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Link to='/' className={styles.link}>
            <Logo className='' />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          {/* Личный кабинет */}
          <Link
            to='/profile'
            className={`${styles.link} ${isActive('/profile') ? styles.link_active : ''}`}
          >
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
