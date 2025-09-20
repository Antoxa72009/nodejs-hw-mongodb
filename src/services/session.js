import { Session } from "../models/session.js";

export const deleteUserSessionsForUser = async (userId) => {
  await Session.deleteMany({ userId });
};