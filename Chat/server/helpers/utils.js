const extractUsernameFromEmail = (email) => {
  // Split the email address at the "@" symbol
  const parts = email.split("@");

  // The first part of the split result is the username
  const username = parts[0];

  return username;
};

module.exports = { extractUsernameFromEmail };
