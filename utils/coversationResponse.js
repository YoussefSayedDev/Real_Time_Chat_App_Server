const createConversationResponse = (conversation, userids) => ({
  conversation,
  participants: userids,
});

module.exports = createConversationResponse;
