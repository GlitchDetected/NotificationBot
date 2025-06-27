"use client";

export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

type links = {
  name: string;
  hash: string;
  isSignIn?: boolean;
};

export const links = [
  {
    name: "Status",
    hash: "/status"
  },
  {
    name: "Commands",
    hash: "/commands"
  },
  {
    name: "Documentation",
    hash: "/docs/home"
  }
];
