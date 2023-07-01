import axios from "axios";

import { API_URL } from "../config";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      // console.error(
      //   "Server out of service or check your Internet connection, please"
      // );
      return Promise.reject(
        new Error(
          "Server out of service or check your Internet connection, please"
        )
      );
    }

    return Promise.reject(error);
  }
);

export default instance;

/*
 * https://stackoverflow.com/questions/47067929/how-to-handle-neterr-connection-refused-in-axios-vue-js#56265847
 * https://axios-http.com/es/docs/interceptors
 * https://lightrains.com/blogs/axios-intercepetors-react/
 */
