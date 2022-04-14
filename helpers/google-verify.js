const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { given_name, family_name, picture, email } = ticket.getPayload();

  console.log(ticket.getPayload())

  return {
    name: `${given_name} ${family_name}`,
    image: picture,
    email,
  };
}

googleVerify().catch(console.error);

module.exports = {
  googleVerify,
};
