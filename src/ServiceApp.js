import React from "react";
import { connect } from "react-redux";

import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import Routes from "./Routes";
import Spinner from "components/Spinner";
import { logout } from "actions/index.js";

class ServiceApp extends React.Component {
  handleLogout = (uid) => {
    this.props.dispatch(logout(uid));
  };
  renderApplication = (auth) => (
    <React.Fragment>
      <Navbar
        handleLogout={() => this.handleLogout(auth.user.uid)}
        auth={auth}
        loadFresh
      />
      <Navbar
        auth={auth}
        handleLogout={() => this.handleLogout(auth.user.uid)}
        id="navbar-clone"
      />
      <Sidebar />
      <Routes />
    </React.Fragment>
  );

  render() {
    const { auth } = this.props;

    // return this.renderApplication(auth);

    return auth.isAuthResolved ? this.renderApplication(auth) : <Spinner />;
  }
}
const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps)(ServiceApp);
