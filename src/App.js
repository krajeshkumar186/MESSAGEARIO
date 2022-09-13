import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import ServiceApp from "./ServiceApp";
import { ToastProvider } from "react-toast-notifications";
import initStore from "./store";
import { Provider } from "react-redux";

import {
  onAuthStateChanged,
  storeAuthUser,
  resetAuthState,
  subscribeToMessages,
  checkUserConnection,
} from "actions/index.js";

const store = initStore();

class App extends React.Component {
  componentDidMount() {
    store.dispatch(resetAuthState());
    this.unsubscribeAuth = onAuthStateChanged(async (authUser) => {
      // debugger;
      await store.dispatch(storeAuthUser(authUser));
      if (authUser) {
        checkUserConnection(authUser.uid);
        this.unsubscribeMessages = store.dispatch(
          subscribeToMessages(authUser.uid)
        );
      }
    });
  }

  // componentWillUnmount() {
  //   // // debugger;
  //   this.unsubscribeAuth();
  //   this.unsubscribeMessages();
  // }

  render() {
    return (
      <Provider store={store}>
        <ToastProvider>
          <Router>
            <ServiceApp />
          </Router>
        </ToastProvider>
      </Provider>
    );
  }
}

export default App;
