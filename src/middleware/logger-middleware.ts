import { Request } from "express";

const rPadStr = (s: string, len: number) => {
  if (len <= 0) {
    throw new Error("bad arg " + len);
  }

  let diff = len - s.length;
  let res = s;
  for (; diff > 0; diff -= 1) {
    res += " ";
  }
  return res;
};

const logBody = (b, method) => {
  if (typeof b === "string") {
    return b;
  } else if (typeof b === "object") {
    const result = JSON.stringify(b);
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
      return result;
    } else {
      return "";
    }
  } else if (!b || typeof b.toString !== "function") {
    return "";
  } else {
    return b.toString();
  }
};

export default (req: Request, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  res.on("finish", () => {
    console.log(
      `${res.statusCode} ${rPadStr(req.method, 6)} ${req.originalUrl}${
        isProd ? "" : " " + logBody(req.body, req.method)
      }`
    );
  });

  next();
};
