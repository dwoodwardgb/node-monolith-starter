import { array, object, string, size, mask } from "superstruct";

// TODO: refactor out a nonEmptyString helper (same goes for spec)
export default object({
  id: size(string(), 1, Infinity),
  emails: size(
    array(
      object({
        value: string(),
      })
    ),
    1,
    Infinity
  ),
  nickname: size(string(), 1, Infinity),
});
