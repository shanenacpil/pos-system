const users = [];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
  createUser: (user) => {
    users.push(user);
    return user;
  },
  getAllUsers: () => users,
};

