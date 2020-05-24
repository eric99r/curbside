
export const isAuthorized = user => {
    return user.isActivated;
    // return user.isAuthorized;
};

export const isAdmin = user => {
    return isAuthorized(user) && user.role === 1;
};

export const isCustomer = user => {
    return isAuthorized(user) && (user.role === 2 || user.role === 1);
};

export const isAuthGuard = (guard, user) => {
    if (guard == "isAdmin") {
        return isAdmin(user);
      }
      else if (guard == "isCustomer") {
          return isCustomer(user);
      }
      else {
          return false;
      }
}