import { isAxiosError } from "axios";
import Cookies from "js-cookie";

import {
  createContext,
  useContext,
  ParentComponent,
  createEffect,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";

import { User, UserLoginRequest, UserRegisterRequest } from "../types";
import axios from "../api/axios-config";

export type AuthContextState = {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly error: string;
  readonly loading: boolean;
};

export type AuthContexValue = [
  state: AuthContextState,
  actions: {
    singup: ((user: UserRegisterRequest) => Promise<void>) | (() => undefined);
    singin: ((user: UserLoginRequest) => Promise<void>) | (() => undefined);
    checkLogin: (() => void) | (() => undefined);
    logout: (() => void) | (() => undefined);
    changeAuthState: ((auth: boolean) => void) | (() => undefined);
    changeErrorState: ((message: string) => void) | (() => undefined);
  }
];

const defaultState = {
  user: null,
  isAuthenticated: false,
  error: "",
  loading: false,
};

const AuthContext = createContext<AuthContexValue>([
  defaultState,
  {
    singup: () => undefined,
    singin: () => undefined,
    checkLogin: () => undefined,
    logout: () => undefined,
    changeAuthState: () => undefined,
    changeErrorState: () => undefined,
  },
]);

export const AuthProvider: ParentComponent<{
  user?: User | null;
  isAuthenticated?: boolean;
  error?: string;
  loading?: boolean;
}> = (props) => {
  const [state, setState] = createStore({
    user: props.user ?? defaultState.user,
    isAuthenticated: props.isAuthenticated ?? defaultState.isAuthenticated,
    error: props.error ?? defaultState.error,
    loading: props.loading ?? defaultState.loading,
  });

  const changeAuthState = (auth: boolean) => setState("isAuthenticated", auth);
  const changeErrorState = (message: string) => setState("error", message);

  const singup = async (user: UserRegisterRequest) => {
    setState("loading", true);

    axios
      .post("/register", user)
      .then((response) => {
        if (response.status == 200) {
          const data: User = response.data;
          setState("user", data);
          changeAuthState(true);
          setState("loading", false);
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          changeErrorState(
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          changeErrorState((err as Error).message);

          setState("loading", false);
        }
      });

    // try {
    //   const response = await registerRequest(user);

    //   console.log(response);

    //   if (response.status == 200) {
    //     const data: User = response.data;
    //     setState("user", data);
    //     changeAuthState(true);
    //   }
    // } catch (err) {
    //   if (isAxiosError<{ [k: string]: string }>(err)) {
    //     // console.error(err.response?.data.message);
    //     changeErrorState(err.response?.data.message || defaultState.error);
    //   } else {
    //     console.error((err as Error).message);
    //   }
    // }
  };

  const singin = async (user: UserLoginRequest) => {
    setState("loading", true);

    axios
      .post("/login", user)
      .then((response) => {
        if (response.status == 200) {
          const data: User = response.data;
          setState("user", data);
          changeAuthState(true);
          setState("loading", false);
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          changeErrorState(
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          changeErrorState((err as Error).message);

          setState("loading", false);
        }
      });

    // try {
    //   const response = await loginRequest(user);

    //   console.log(response);

    //   if (response.status == 200) {
    //     const data: User = response.data;
    //     setState("user", data);
    //     changeAuthState(true);
    //   }
    // } catch (err) {
    //   if (isAxiosError<{ [k: string]: string }>(err)) {
    //     // console.error(err.response?.data.message);
    //     changeErrorState(err.response?.data.message || defaultState.error);
    //   } else {
    //     console.error((err as Error).message);
    //   }
    // }
  };

  const checkLogin = () => {
    const token = Cookies.get("token");
    // console.log(token);

    if (!token) {
      changeAuthState(false);
      setState("user", null);
      changeErrorState("There is no token. you are not authorized");
      return;
    }

    setState("loading", true);

    axios
      .get("/auth-verify")
      .then((response) => {
        if (response.status == 200) {
          const data: User = response.data;
          changeAuthState(true);
          setState("user", data);
          setState("loading", false);
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data.message);
          changeAuthState(false);
          setState("user", null);
          changeErrorState(err.response?.data.message || defaultState.error);
          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          changeErrorState((err as Error).message);
          setState("loading", false);
        }
      });

    // try {
    //   const response = await verifyTokenRequest();

    //   if (response.status == 200) {
    //     const data: User = response.data;
    //     changeAuthState(true);
    //     setState("user", data);
    //   }
    // } catch (_err) {
    //   changeAuthState(false);
    //   setState("user", null);
    // }
  };

  const logout = () => {
    Cookies.remove("token");
    changeAuthState(false);
    setState("user", null);
  };

  createEffect(() => {
    if (!!state.error) {
      const timer = setTimeout(() => {
        changeErrorState("");
      }, 5000);
      onCleanup(() => clearTimeout(timer));
    }
  });

  return (
    <AuthContext.Provider
      value={[
        state,
        {
          changeAuthState,
          changeErrorState,
          singup,
          singin,
          checkLogin,
          logout,
        },
      ]}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// function createAuthStore() {
//   const [user, setUser] = createSignal<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = createSignal(false);
//
//   const singup = async (user: UserRegisterRequest) => {
//     try {
//       const response = await registerRequest(user);
//
//       console.log(response);
//
//       if (response.status == 200) {
//         const data: User = response.data;
//         setUser(data);
//         setIsAuthenticated(true);
//       }
//     } catch (err) {
//       if (isAxiosError<{ [k: string]: string }>(err)) {
//         console.error(err.response?.data.message);
//         // Una veces la key ({ [k: string]: string }) es «message» para los 400/404
//         // y otras veces es «error» para los 500. Por lo tanto hay que verificar el
//         // backend para ver que se pone en cada caso.
//         // setError(error.response!.data.body.error);
//       } else {
//         console.error(err);
//       }
//     }
//   };
//
//   return { user, singup, isAuthenticated };
// }

// export default createRoot(createAuthStore);
