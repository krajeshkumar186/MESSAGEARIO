/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useState } from "react";
import RegisterForm from "components/auth/RegisterForm";
import { register } from "actions/index.js";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router";
import OnlyGuest from "HOC/OnlyGuest";

const Register = (props) => {
  const [redirect, setRedirect] = useState(false);
  const { addToast } = useToasts();
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
  const registerUser = (userData) => {
    // props.history.push('/')
    userData.fullName = capitalize(userData.fullName);
    register(userData).then(
      (_) => {
        addToast("Successfully Registered! Redirecting to home page", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 4000,
        });
        setTimeout(() => {
          setRedirect(true);
        }, 4000);
      },
      (errorMessage) =>
        addToast(errorMessage, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        })
    );
  };
  if (redirect) {
    return <Redirect to="/" />;
  }
  return (
    <div className="auth-page">
      <div className="container has-text-centered">
        <div className="column is-4 is-offset-4">
          <h3 className="title has-text-grey">Register</h3>
          <p className="subtitle has-text-grey">Please Register to proceed.</p>
          <div className="box">
            <figure className="avatar">
              <img src="https://placehold.it/128x128" alt="Company Logo" />
            </figure>
            <RegisterForm onRegister={registerUser} />
          </div>
          <p className="has-text-grey">
            <a>Sign In With Google</a>&nbsp;
            <a href="/">Sign Up</a> &nbsp;·&nbsp;
            <a href="/">Need Help?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnlyGuest(Register);
