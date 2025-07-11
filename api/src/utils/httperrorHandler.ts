import { ZodError, type ZodIssue } from "zod";

import type { HttpErrorEntry } from "@/constants/http-error";
import { HttpErrorCode, HttpErrorMessage } from "@/constants/http-error";

export function httpError(message: HttpErrorEntry = HttpErrorMessage.ServerError, customMessage?: string | ZodError) {
    const code = getErrorCodeByMessage(message);

    return Response.json( // return or throw: either one works
        {
            code,
            message: customMessage instanceof ZodError
                ? parseZodError(customMessage)
                : (customMessage || message)
        },
        {
            status: code > 599
                ? 400
                : code
        }
    );
}

const httpErrorMessages = Object.entries(HttpErrorMessage);

function getErrorCodeByMessage(message: HttpErrorEntry) {
    const entry = httpErrorMessages.find(([, val]) => val === message)!;
    return HttpErrorCode[entry[0] as keyof typeof HttpErrorCode];
}

function parseZodError(error: ZodError) {
    const errors: string[] = [];

    const formatSchemaPath = (path: (string | number)[]) => {
        return !path.length ? "Schema" : path.join(".");
    };

    const firstLetterToLowerCase = (str: string) => {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };

    const makeSureItsString = (value: unknown) => {
        return typeof value === "string" ? value : JSON.stringify(value);
    };

    const parseZodIssue = (issue: ZodIssue) => {
        switch (issue.code) {
            case "invalid_type": return `${formatSchemaPath(issue.path)} must be a ${issue.expected}`;
            case "invalid_literal": return `${formatSchemaPath(issue.path)} must be a ${makeSureItsString(issue.expected)}`;
            case "custom": return `${formatSchemaPath(issue.path)}: ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_union": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_union_discriminator": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_enum_value": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "unrecognized_keys": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_arguments": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_return_type": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_date": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_string": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "too_small": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "too_big": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_intersection_types": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "not_multiple_of": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "not_finite": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            default: return `Schema has an unknown error (JSON: ${JSON.stringify(issue)})`;
        }
    };

    for (const issue of error.issues) {
        const parsedIssue = `${parseZodIssue(issue)}.`;
        if (parsedIssue) errors.push(parsedIssue);
    }

    return errors
        .join(" ")
        .replace(/^[\s\n]+|[\s\n]+$/g, "")
        .trim();
}