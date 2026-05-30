import {
  fetchUser,
  login,
  logout,
  register,
  updateUser,
  userReducer
} from './user';

const mockUser = {
  email: 'test@gmail.com',
  name: 'User test'
};

describe('user test', () => {
  const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: undefined as string | undefined
  };

  it('fetchUser.pending', () => {
    const state = userReducer(initialState, fetchUser.pending('id', undefined));

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('fetchUser.fulfilled', () => {
    const state = userReducer(
      initialState,
      fetchUser.fulfilled(mockUser, 'id', undefined)
    );

    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBe(undefined);
  });

  it('fetchUser.rejected', () => {
    const state = userReducer(
      initialState,
      fetchUser.rejected(new Error('user rejected'), 'id', undefined)
    );

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('user rejected');
  });
});

describe('user login test', () => {
  const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: undefined as string | undefined
  };

  it('login.pending', () => {
    const state = userReducer(
      initialState,
      login.pending('id', { email: 'test@gmail.com', password: '0000' })
    );

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('login.fulfilled', () => {
    const state = userReducer(
      initialState,
      login.fulfilled(mockUser, 'id', {
        email: 'test@gmail.com',
        password: '0000'
      })
    );

    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBe(undefined);
  });

  it('login.rejected', () => {
    const state = userReducer(
      initialState,
      login.rejected(new Error('user rejected'), 'id', {
        email: 'test@gmail.com',
        password: '0000'
      })
    );

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('user rejected');
  });
});

describe('user register test', () => {
  const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: undefined as string | undefined
  };

  it('register.pending', () => {
    const state = userReducer(
      initialState,
      register.pending('id', { name: '', email: '', password: '' })
    );

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('register.fulfilled', () => {
    const state = userReducer(
      initialState,
      register.fulfilled(mockUser, 'id', { name: '', email: '', password: '' })
    );

    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBe(undefined);
  });

  it('register.rejected', () => {
    const state = userReducer(
      initialState,
      register.rejected(new Error('user rejected'), 'id', {
        name: '',
        email: '',
        password: ''
      })
    );

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('user rejected');
  });
});

describe('user update test', () => {
  const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: undefined as string | undefined
  };

  it('updateUser.pending', () => {
    const state = userReducer(
      initialState,
      updateUser.pending('id', {
        name: 'new',
        email: 'new@gmail.com'
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('updateUser.fulfilled', () => {
    const state = userReducer(
      { ...initialState, user: mockUser, isAuth: true },
      updateUser.fulfilled({ name: 'new', email: 'new@gmail.com' }, 'id', {})
    );

    expect(state.user).toEqual({ name: 'new', email: 'new@gmail.com' });
    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(undefined);
  });

  it('updateUser.rejected', () => {
    const state = userReducer(
      initialState,
      updateUser.rejected(new Error('update user error'), 'id', {
        name: 'new',
        email: 'new@gmail.com'
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('update user error');
  });
});

describe('user logout test', () => {
  const authState = {
    user: mockUser,
    isAuth: true,
    isLoading: false,
    error: undefined as string | undefined
  };

  it('logout.fulfilled', () => {
    const state = userReducer(authState, logout.fulfilled(undefined, ''));

    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe(undefined);
  });
});
