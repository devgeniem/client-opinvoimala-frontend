import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { path, rt } from '../../routes/routes';
import Icon from '../Icon';
import Button from '../inputs/Button';
import DropdownMenu, { MenuItem } from '../DropdownMenu';
import useWindowDimensions from '../../utils/hooks';
import Drawer from '../Drawer';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/storeContext';

const DesktopMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu
      items={items}
      align="right"
      verticalPosition={20}
      triggerEl={
        <Button
          id="user-menu__button"
          text={t('student')}
          icon={<Icon type="User" color="primary" />}
          color="primary"
          variant="link"
          onClick={() => {}}
        />
      }
    />
  );
};

const MobileMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  return (
    <Drawer
      triggerEl={
        <Button
          id="user-menu__button"
          variant="outlined"
          color="primary"
          icon={<Icon type="User" color="primary" />}
          onClick={() => {}}
        />
      }
    >
      <ul>
        {items.map(({ id, label, url }) => (
          <li key={id}>
            {url ? <NavLink to={url}>{label}</NavLink> : <span>{label}</span>}
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

const UserMenu: React.FC = observer(() => {
  const { t } = useTranslation();

  const { isTablet } = useWindowDimensions();

  const {
    auth: { isLoggedIn },
  } = useStore();

  const handleLoginClick = () => {
    console.log('TODO: Open login form!');
  };

  if (isLoggedIn) {
    const items = [
      {
        id: 'my_profile',
        label: rt('my_profile'),
        url: `/${path('my_profile')}`,
      },
      { id: 'tests', label: rt('tests'), url: `/${path('tests')}` },
      {
        id: 'appointments',
        label: rt('appointments'),
        url: `/${path('appointments')}`,
      },
      {
        id: 'change_password',
        label: rt('change_password'),
        url: `/${path('change_password')}`,
      },
      {
        id: 'logout',
        label: rt('logout'),
        url: `/${path('logout')}`,
      },
    ];

    return isTablet ? (
      <MobileMenu items={items} />
    ) : (
      <DesktopMenu items={items} />
    );
  } else {
    // User is not logged in, show login button.
    return (
      <Button
        id="user-menu__login__button"
        text={isTablet ? undefined : t('action.login')}
        variant={isTablet ? 'outlined' : 'filled'}
        color={isTablet ? 'primary' : 'secondary'}
        icon={
          <Icon type="SignIn" color={isTablet ? 'primary' : 'background'} />
        }
        onClick={handleLoginClick}
      />
    );
  }
});

export default UserMenu;