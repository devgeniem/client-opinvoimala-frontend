import {
  Instance,
  types,
  flow,
  cast,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import api from '../services/api/Api';
import Storage from '../services/storage';

const States = ['IDLE' as const, 'PROCESSING' as const, 'ERROR' as const];

const UserModel = types.model({
  id: types.number,
});

export interface IUserModel extends Instance<typeof UserModel> {}
export interface User extends SnapshotOut<typeof UserModel> {}
export interface UserIn extends SnapshotIn<typeof UserModel> {}

export const AuthStore = types
  .model({
    state: types.enumeration('State', States),

    jwt: types.optional(
      types.maybeNull(types.string),
      Storage.read({ key: 'AUTH_TOKEN' })
    ),
    user: types.maybeNull(UserModel),
    isLoginModalOpen: types.optional(types.boolean, false),
  })
  .views(self => ({
    get isLoggedIn() {
      return !!self.jwt?.length;
    },
    get showLoginModal() {
      return self.isLoginModalOpen && !this.isLoggedIn;
    },
  }))
  .actions(self => {
    const register = flow(function* (params: API.AuthRegister) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> = yield api.register(
        params
      );

      if (response.kind === 'ok') {
        self.user = cast(response.data.user);
        self.jwt = cast(response.data.jwt);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const openLoginModal = () => {
      if (!self.isLoggedIn) {
        self.isLoginModalOpen = true;
      }
    };

    const closeLoginModal = () => {
      self.isLoginModalOpen = false;
    };

    const login = flow(function* (params: API.AuthLogin) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> = yield api.login(
        params
      );

      if (response.kind === 'ok') {
        self.user = cast(response.data.user);
        self.jwt = cast(response.data.jwt);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const changePassword = flow(function* (params: API.AuthChangePassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.User> =
        yield api.changePassword(params);

      if (response.kind === 'ok') {
        self.user = cast(response.data);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const forgotPassword = flow(function* (params: API.AuthForgotPassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.AuthForgotPassword> =
        yield api.forgotPassword(params);

      if (response.kind === 'ok') {
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const resetPassword = flow(function* (params: API.AuthResetPassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> =
        yield api.resetPassword(params);

      if (response.kind === 'ok') {
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const logout = flow(function* () {
      self.state = 'PROCESSING';
      self.jwt = null;
      self.user = null;
      Storage.write({ key: 'AUTH_TOKEN', value: null });
      yield api.logout();
      self.state = 'IDLE';
    });

    return {
      register,
      openLoginModal,
      closeLoginModal,
      login,
      changePassword,
      forgotPassword,
      resetPassword,
      logout,
    };
  });

export interface IAuthStore extends Instance<typeof AuthStore> {}
