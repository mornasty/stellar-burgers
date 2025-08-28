import {
  selectIsAuthChecked,
  selectIsLaunched,
  selectStatus,
  selectUser
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  redirectParam?: string;
  children: React.ReactElement;
}

export const ProtectedRoute = ({
  redirectParam = '/login',
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  // const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser); // userDataSelector — селектор получения пользователя из store
  const location = useLocation();
  const status = useSelector(selectStatus);
  const isLaunched = useSelector(selectIsLaunched);

  if (!isLaunched && status !== 'received') {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to={redirectParam} state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (onlyUnAuth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    // при обратном редиректе получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть, если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};

export default ProtectedRoute;
