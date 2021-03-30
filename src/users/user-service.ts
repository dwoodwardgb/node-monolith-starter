import { Connection, Repository } from "typeorm";
import { Profile, User } from "./user-entity";

const findByAuth0Id = async (users: Repository<User>, auth0Id: string) => {
  if (!auth0Id) {
    throw new Error();
  }

  return await users.findOne({
    where: { profile: { auth0Id: auth0Id } },
  });
};

const createUserFromProfile = async (
  users: Repository<User>,
  profile: Profile
) => {
  return await users.save({ profile });
};

export const upsertUserByProfile = async (db: Connection, profile: Profile) => {
  const users = db.getRepository(User);

  let user = await findByAuth0Id(users, profile.auth0Id);
  if (!user) {
    user = await createUserFromProfile(users, profile);
  }
  return user;
};
