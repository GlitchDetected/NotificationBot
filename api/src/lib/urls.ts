export const getBaseUrl = () => {
  return process.env.BASE_URL ?? "http://localhost:3001";
};

export const getCanonicalUrl = (...pages: string[]) => {
  return `${getBaseUrl()}/${pages.join("/")}`;
};
