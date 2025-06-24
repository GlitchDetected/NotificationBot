"use client";

export const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;

type links = {
  name: string;
  hash: string;
  isSignIn?: boolean;
};

export const links = [
  {
    name: "Uptime",
    hash: "/uptime"
  },
  {
    name: "Commands",
    hash: "/commands"
  },
  {
    name: "Docs",
    hash: "/docs"
  }
];
