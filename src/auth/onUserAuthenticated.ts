import { PrismaClient } from "@prisma/client";

/*
Sample JWT
{
  email: 'dwoodwardgb2@yahoo.com',
  name: 'dwoodwardgb2@yahoo.com',
  nickname: 'dwoodwardgb2',
  picture: 'https://s.gravatar.com/avatar/311581c51c949615bff24f07f35fa056?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdw.png',
  last_password_reset: '2021-09-28T20:55:33.034Z',
  id_token: '...',
  clientID: 'ErHlxm42XjVKfX7R1b68HYgSH9JjTNHW',
  created_at: '2021-09-27T01:09:27.586Z',
  email_verified: true,
  identities: [
    {
      user_id: '615119c7a3927100701c0385',
      provider: 'auth0',
      connection: 'Username-Password-Authentication',
      isSocial: false
    }
  ],
  updated_at: '2021-10-02T11:15:10.067Z',
  user_id: 'auth0|615119c7a3927100701c0385',
  user_metadata: {},
  app_metadata: {},
  iss: 'https://dwoodwardgb.auth0.com/',
  sub: 'auth0|615119c7a3927100701c0385',
  aud: 'ErHlxm42XjVKfX7R1b68HYgSH9JjTNHW',
  iat: 1633173310,
  exp: 1633209310
}
 */

const creatOnUserAuthenticated = ({ db }: { db: PrismaClient }) =>
  async function onUserAuthenticated(auth0UserToken: any) {
    let user = await db.user.findFirst({
      where: { auth0Id: auth0UserToken.user_id },
    });
    if (!user) {
      user = await db.user.create({
        data: {
          auth0Id: auth0UserToken.user_id,
          email: auth0UserToken.email,
          nickname: auth0UserToken.nickname,
        },
      });
    }
    return user;
  };

export type OnUserAuthenticated = ReturnType<typeof creatOnUserAuthenticated>;

export default creatOnUserAuthenticated;
