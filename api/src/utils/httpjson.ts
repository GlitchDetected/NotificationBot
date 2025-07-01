export const HttpErrorCode = {
    // 4xx
    BadRequest: 400,
    InvalidAuthorization: 401,
    coderequired: 401,
    NotFound: 404,

    // 5xx
    ServerError: 500,
    guildFetchError: 500,

    // custom using 4xx
    InvalidCaptcha: 403,

    // unknown object - 10xxx
    UnknownAccount: 10_001,

    // validation issue - 50xxx
    InvalidSessionToken: 50_001,
    MissingAccess: 50_001
} as const;

export const HttpErrorMessage = {
    // 4xx
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    coderequired: "A 'code' query parameter must be present in the URL.",
    NotFound: "This route cannot be found or method is not in use",

    // 5xx
    ServerError: "Something went wrong, try again later",
    guildFetchError: "Failed to fetch guild details",

    // custom using 4xx
    InvalidCaptcha: "Complete the CAPTCHA and try again",

    // unknown object - 10xxx
    UnknownAccount: "Unknown account",

    // validation issue - 50xxx
    InvalidSessionToken: "invalid or missing session token",
    MissingAccess: "Missing access or not logged in"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorMessage[keyof typeof HttpErrorMessage];