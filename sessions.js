class SessionStore {
  constructor() {
    this.sessions = {};
  }

  setSession(userId, data) {
    this.sessions[userId] = data;
  }

  getSession(userId) {
    return this.sessions[userId];
  }

  sessionWithUserIdExists(userId) {
    return this.sessions[userId] !== undefined;
  }

  sessionExists(userId) {
    return this.sessions[userId] !== undefined;
  }

  isValidSession(userId, iat, exp) {
    const session = this.getSession(userId);
    return session && iat === session.iat && ((new Date().getTime() / 1000) < exp);
  }

  deleteSession(userId) {
    delete this.sessions[userId];
  }
}

export default new SessionStore();
