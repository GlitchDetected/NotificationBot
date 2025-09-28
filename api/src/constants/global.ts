export const now = new Date().toISOString();

export function asArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (typeof value === "object" && value !== null) return Object.values(value);
    return [];
}