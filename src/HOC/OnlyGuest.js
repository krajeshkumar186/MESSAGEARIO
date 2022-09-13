import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const OnlyGuest = (Component) => {
  class OnlyGuest extends React.Component {
    render() {
      const { auth, dispatch, ...rest } = this.props;
      return auth.isAuth ? <Redirect to="/" /> : <Component {...rest} />;
    }
  }

  return connect(({ auth }) => ({ auth }))(OnlyGuest);
};

export default OnlyGuest;
