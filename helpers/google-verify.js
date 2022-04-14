const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token = "") {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing JWT_SECRET. Refusing to authenticate");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { given_name, family_name, picture, email } = ticket.getPayload();

  console.log(ticket.getPayload());

  return {
    name: `${given_name} ${family_name}`,
    image: picture,
    email,
  };
}

module.exports = {
  googleVerify,
};
