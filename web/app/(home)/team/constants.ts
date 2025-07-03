export const repos = [
    "glitchdetected/notificationbot"
] as const;

export enum TeamType {
    Developer = "developer",
    AdditionalProgramming = "additional-programming",
    Donator = "donator"
}

export const members = [
    {
        id: "920487197046607872",
        team: TeamType.Developer,
        social: "https://github.com/glitchdetected"
    },

    {
        id: "1249812467861684239",
        team: TeamType.AdditionalProgramming,
        social: "https://github.com/TermuxHackz"
    },
    {
        id: "920487197046607872",
        team: TeamType.Donator
    }
] as const;