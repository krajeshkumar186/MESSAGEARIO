import React from "react";
import ServiceItem from "components/service/ServiceItem";
import withAuthorization from "HOC/WithAuthorization";
import {
  fetchSentOffers,
  newMessage,
  newCollaboration,
  collaborate,
} from "actions/index.js";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";

class SentOffers extends React.Component {
  componentDidMount() {
    const { auth } = this.props;
    this.props.dispatch(fetchSentOffers(auth.user.uid));
  }
  createCollaboration = (offer) => {
    const {
      auth: { user },
      toastManager,
    } = this.props;

    const collaboration = newCollaboration({ offer, fromUser: user });
    const message = newMessage({ offer, fromUser: user });

    this.props.dispatch(collaborate({ collaboration, message })).then((_) =>
      toastManager.add("Collaboration was Created!", {
        appearance: "success",
        autoDismiss: true,
      })
    );
  };
  statusClass = (status) => {
    if (status === "pending") return "is-warning";
    if (status === "accepted") return "is-success";
    if (status === "declined") return "is-danger";
  };
  render() {
    const { offers } = this.props;
    return (
      <div className="container">
        <div className="content-wrapper">
          <h1 className="title">Sent Offers</h1>
          {offers.length === 0 && (
            <span className="tag is-warning is-large">
              You don't have any sent offers :(
            </span>
          )}
          <div className="columns is-multiline">
            {offers.map((offer) => (
              <div key={offer.id} className="column is-one-third ">
                <ServiceItem
                  noButton
                  className="offer-card"
                  service={offer.service}
                >
                  <div
                    className={`tag is-large ${this.statusClass(offer.status)}`}
                  >
                    {offer.status}
                  </div>
                  <hr />
                  <div className="service-offer">
                    <div>
                      <span className="label">To User:</span>{" "}
                      {offer.toUser.fullName}
                    </div>
                    <div>
                      <span className="label">Note:</span> {offer.note}
                    </div>
                    <div>
                      <span className="label">Price:</span> ${offer.price}
                    </div>
                    <div>
                      <span className="label">Time:</span> {offer.time} hours
                    </div>
                    {offer.status === "accepted" &&
                      !offer.collaborationCreated && (
                        <div>
                          <hr />
                          <button
                            onClick={() => this.createCollaboration(offer)}
                            className="button is-success"
                          >
                            Collaborate
                          </button>
                        </div>
                      )}
                  </div>
                </ServiceItem>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ offers }) => ({ offers: offers.sent });
const SentOffersWithToast = withToastManager(SentOffers);
export default withAuthorization(connect(mapStateToProps)(SentOffersWithToast));
