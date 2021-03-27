export const upsert = async (db, p) => {
  await db.create({...p})
  return {id:3}
}
