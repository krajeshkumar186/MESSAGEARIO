import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

const Modal = (props) => {
  const [isActive, setIsActive] = useState(false);

  const [willRedirect, setwillRedirect] = useState(false);

  const { addToast } = useToasts();
  const changeModalState = (modalState) => {
    if (!props.auth.user.uid) {
      addToast("To make an offer you should be logned In ", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      setTimeout(() => {
        setwillRedirect(true);
      }, 3000);
      return;
    }
    setIsActive(modalState);
  };

  if (willRedirect === true) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <button
        onClick={() => changeModalState(true)}
        type="button"
        className="button is-medium is-info is-outlined"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        {props.openButtonText || "Open"}
      </button>
      <div className={`modal ${isActive ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Make a Deal</p>
            <button
              onClick={() => changeModalState(false)}
              className="delete"
              aria-label="close"
            ></button>
          </header>
          <section className="modal-card-body">{props.children}</section>
          <footer className="modal-card-foot">
            <button
              onClick={() => props.onModalSubmit(() => changeModalState(false))}
              className="button is-success"
            >
              Save changes
            </button>
            <button onClick={() => changeModalState(false)} className="button">
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Modal);
