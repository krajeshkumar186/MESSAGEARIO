import * as api from "api";
import { Timestamp } from "db";
import {
  COLLABORATION_CREATED_FROM_OFFER,
  FETCH_USER_MESSAGES_SUCCESS,
  SET_COLLABORATION,
  SET_COLLABORATION_JOINED_PEOPLE,
  UPDATE_COLLABORATION_USER,
  SET_COLLABORATION_MESSAGES,
  RESET_COLLABORATION_MESSAGES,
} from "types";

export const newCollaboration = ({
  offer: { service, time, toUser, id },
  fromUser,
}) => ({
  serviceId: service.id, // define ID on offer.service
  title: service.title,
  image: service.image,
  time: time * 60 * 60,
  allowedPeople: [fromUser.uid, toUser.uid],
  joinedPeople: [],
  toUser: toUser.uid,
  status: "pending",
  fromUser: fromUser.uid,
  fromOffer: id,
  createdAt: Timestamp.fromDate(new Date()),
});

export const newMessage = ({ offer: { service, toUser }, fromUser }) => ({
  isRead: false,
  type: "invitation",
  text: `Hello ${toUser.fullName}, please join collaboration as soon as possible`,
  cta: "", // click to action
  toUser: toUser.uid,
  fromUser: {
    name: fromUser.fullName,
    avatar: fromUser.avatar,
  },
  serviceTitle: service.title,
  serviceLink: `/services/${service.id}`,
  createdAt: Timestamp.fromDate(new Date()),
});

export const collaborate = ({ collaboration, message }) => (dispatch) =>
  api.createCollaboration(collaboration).then((collabId) => {
    message.cta = `/collaborations/${collabId}`;
    api.sendMessage(message);
    api.markOfferAsInCollaboration(collaboration.fromOffer);
    dispatch({
      type: COLLABORATION_CREATED_FROM_OFFER,
      offerId: collaboration.fromOffer,
      offersType: "sent",
    });
    return collabId;
  });

export const subscribeToMessages = (userId) => (dispatch) =>
  api.subscribeToMessages(userId, (messages) =>
    dispatch({ type: FETCH_USER_MESSAGES_SUCCESS, messages })
  );

export const markMessageAsRead = (message) => api.markMessageAsRead(message);
export const fetchCollaborations = (userId) => api.fetchCollaborations(userId);

export const subToCollaboration = (collabId, callback) => (dispatch) =>
  api.subToCollaboration(collabId, async (collaboration) => {
    let joinedPeople = [];

    if (collaboration.joinedPeople) {
      joinedPeople = await Promise.all(
        collaboration.joinedPeople.map(async (userRef) => {
          const userSnapshot = await userRef.get();
          return { id: userSnapshot.id, ...userSnapshot.data() };
        })
      );
    }

    dispatch({ type: SET_COLLABORATION, collaboration });
    dispatch({ type: SET_COLLABORATION_JOINED_PEOPLE, joinedPeople });

    callback(joinedPeople);
  });
export const joinCollaboration = (collabId, userId) =>
  api.joinCollaboration(collabId, userId);
export const leaveCollaboration = (collabId, userId) =>
  api.leaveCollaboration(collabId, userId);

export const subToProfile = (uid) => (dispatch) =>
  api.subToProfile(uid, (user) => {
    return dispatch({ type: UPDATE_COLLABORATION_USER, user });
  });

export const sendChatMessage = (message) => api.sendChatMessage(message);

export const subToMessages = (collabId) => (dispatch) => {
  dispatch({ type: RESET_COLLABORATION_MESSAGES });
  return api.subToMessages(collabId, (messages) => {
    dispatch({ type: SET_COLLABORATION_MESSAGES, messages });
  });
};

export const startCollaboration = (collabId, expiresAt) =>
  api.startCollaboration(collabId, expiresAt);
