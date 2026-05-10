// App.tsx
import React from "react";
import { Navigation } from "./Navigation";
import { Provider } from "react-redux";
import { store } from "redux/store";
import Toast from "react-native-toast-message";
import toastConfig from "./toastConfig";

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
      <Toast />
    </Provider>
  );
};

export default App;
