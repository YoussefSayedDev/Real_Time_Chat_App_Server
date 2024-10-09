const createUserResponse = (user, token) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile_picture: user.profile_picture,
  token,
});

module.exports = createUserResponse;
