import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const currentURL = location.pathname;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon
              type={
                currentURL === '/' || currentURL.includes('ingredients')
                  ? 'primary'
                  : 'secondary'
              }
            />
            <NavLink
              to={'/'}
              className={({ isActive }) =>
                `text text_type_main-default  ml-2 mr-10 ${
                  styles.link
                } ${isActive || currentURL.includes('ingredients') ? styles.link_active : ''}`
              }
            >
              Конструктор
            </NavLink>
          </>

          <>
            <ListIcon type={currentURL === '/feed' ? 'primary' : 'secondary'} />

            <NavLink
              to={'/feed'}
              className={({ isActive }) =>
                `text text_type_main-default ml-2 ${
                  styles.link
                } ${isActive ? styles.link_active : ''}`
              }
            >
              Лента заказов
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon
            type={currentURL === '/profile' ? 'primary' : 'secondary'}
          />

          <NavLink
            to={userName ? '/profile' : '/login'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
