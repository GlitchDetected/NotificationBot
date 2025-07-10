export function replacePlaceholder(
    template: string,
    values: Record<string, string | number | undefined>
): string {
    let result = template;

    for (const [key, value] of Object.entries(values)) {
        const regex = new RegExp(`\\{${key}\\}`, "g");
        result = result.replace(regex, String(value));
    }

    return result;
}