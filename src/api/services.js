import "firebase/auth";

import db from "db";

// --------- SERVICES ----------

export const fetchServiceById = (serviceId) =>
  db
    .collection("services")
    .doc(serviceId)
    .get()
    .then((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));

export const fetchServices = () =>
  db
    .collection("services")
    .get()
    .then((snapshot) => {
      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return services;
    });

export const fetchUserServices = async (userId) => {
  const userDbRef = await db.collection("profiles").doc(userId);
  // debugger;
  return db
    .collection("services")
    .where("user", "==", userDbRef)
    .get()
    .then((snapshot) => {
      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return services;
    })
    .catch((err) => console.log(err));
};
export const createService = (newService) => {
  return db
    .collection("services")
    .add(newService)
    .then((docRef) => docRef.id);
};
// --------- SERVICES END ----------
