const { OAuth2Client } = require("google-auth-library");
const debug = require('../utils/debug')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token = "") {
  if (!process.env.GOOGLE_CLIENT_ID) {
    debug("NO tienes un GOOGLE_CLIENT en el .env.", "error")
    throw new Error("NO tienes un GOOGLE_CLIENT en el .env.");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { given_name, family_name, picture, email } = ticket.getPayload();

  return {
    name: `${given_name} ${family_name}`,
    image: picture,
    email,
  };
}

module.exports = {
  googleVerify,
};
