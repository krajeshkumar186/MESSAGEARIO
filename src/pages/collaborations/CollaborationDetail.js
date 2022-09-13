import React from "react";
import withAuthorization from "HOC/WithAuthorization";
import { connect } from "react-redux";
import {
  subToCollaboration,
  joinCollaboration,
  subToProfile,
  leaveCollaboration,
  sendChatMessage,
  subToMessages,
  startCollaboration,
} from "actions";
import moment from "moment";
import { Timestamp } from "db";
import Spinner from "components/Spinner";
import Timer from "components/collobration/Timer";
import JoinedPeople from "components/collobration/JoinedPeople";
import ChatMessages from "components/collobration/Chatmessages";

class CollaborationDetail extends React.Component {
  state = {
    inputValue: "",
    reload: false,
  };
  subscribeToProfile = (joinedPeople) => {
    return joinedPeople.map((user) => {
      return this.props.dispatch(subToProfile(user.id));
    });
  };
  componentDidMount() {
    const { collabId } = this.props.match.params;
    const { user } = this.props.auth;
    this.props.dispatch(subToCollaboration(collabId, this.subscribeToProfile));

    this.props.dispatch(subToMessages(collabId));
    joinCollaboration(collabId, user.uid);
  }
  componentWillUnmount() {
    const { collabId } = this.props.match.params;
    const { user } = this.props.auth;
    leaveCollaboration(collabId, user.uid);
  }

  onSendMessage = (inputValue) => {
    if (inputValue.trim() === "") {
      return;
    }

    const timestamp = moment().valueOf().toString();
    const { user } = this.props.auth;
    const { collaboration } = this.props;

    const message = {
      user: {
        uid: user.uid,
        avatar: user.avatar,
        name: user.fullName,
      },
      timestamp: parseInt(timestamp, 10),
      content: inputValue.trim(),
    };

    sendChatMessage({
      message,
      collabId: collaboration.id,
      timestamp,
    }).then((_) => this.setState({ inputValue: "" }));
  };
  onStartCollaboration = (collaboration) => {
    const { id, time } = collaboration;
    const nowSeconds = Timestamp.now().seconds;

    const expiresAt = new Timestamp(nowSeconds + time, 0);
    startCollaboration(id, expiresAt);
  };
  getCollaborationStatus = (collaboration) => {
    if (Object.keys(collaboration).length === 0) {
      return "loading";
    }

    if (!collaboration.expiresAt) {
      return "notStarted";
    }
    if (Timestamp.now().seconds < collaboration.expiresAt.seconds) {
      return "active";
    } else {
      return "finished";
    }
  };
  timeOutCallback = () => this.setState({ reload: true });
  render() {
    const { collaboration, joinedPeople, messages } = this.props;
    const { inputValue } = this.state;
    const { user } = this.props.auth;
    const status = this.getCollaborationStatus(collaboration);

    if (status === "loading") {
      return <Spinner />;
    }
    return (
      <div className="content-wrapper">
        <div className="root">
          <div className="body">
            <div className="viewListUser">
              <JoinedPeople users={joinedPeople} />
            </div>
            <div className="viewBoard">
              <div className="viewChatBoard">
                <div className="headerChatBoard">
                  <div className="headerChatUser">
                    <img
                      className="viewAvatarItem"
                      src={user.avatar}
                      alt="icon avatar"
                    />
                    <span className="textHeaderChatBoard">{user.fullName}</span>
                  </div>
                  <div className="headerChatButton">
                    {status === "notStarted" && (
                      <div className="headerChatButton">
                        <button
                          onClick={() =>
                            this.onStartCollaboration(collaboration)
                          }
                          className="button is-success"
                        >
                          Start Collaboration
                        </button>
                      </div>
                    )}
                    {status === "active" && (
                      <Timer
                        seconds={
                          collaboration.expiresAt.seconds -
                          Timestamp.now().seconds
                        }
                        timeOutCallback={this.timeOutCallback}
                      />
                    )}
                    {status === "finished" && (
                      <span className="tag is-warning is-large">
                        Collaboration has been finished
                      </span>
                    )}
                  </div>
                </div>
                <div className="viewListContentChat">
                  <ChatMessages messages={messages} authUser={user} />
                  <div style={{ float: "left", clear: "both" }}></div>
                </div>
                <div className="viewBottom">
                  <input
                    onChange={(event) =>
                      this.setState({ inputValue: event.target.value })
                    }
                    onKeyPress={(event) => {
                      if (event.key === "Enter") this.onSendMessage(inputValue);
                    }}
                    disabled={status === "finished" || status === "notStarted"}
                    value={inputValue}
                    className="viewInput"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={() => this.onSendMessage(inputValue)}
                    className="button is-primary is-medium"
                    disabled={status === "finished" || status === "notStarted"}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const Collaboration = withAuthorization(CollaborationDetail);
const mapStatetoProps = (state) => {
  return {
    collaboration: state.collaboration.joined,
    joinedPeople: state.collaboration.joinedPeople,
    messages: state.collaboration.messages,
  };
};
export default connect(mapStatetoProps)(Collaboration);
