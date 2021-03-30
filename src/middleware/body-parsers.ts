import express from "express";

// None of these are globally applied because the "raw" one would conflict with the others
// instead the desired parser should be applied inline where needed
export const json = express.json();
export const urlencoded = express.urlencoded({ extended: true });
export const raw = express.raw({ type: "*/*" });
