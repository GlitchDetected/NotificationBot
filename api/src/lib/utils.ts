import { PermissionsBitField, PermissionsString } from "discord.js";

/**
 * @param {string | number | bigint} permissions
 * @param {import('discord.js').PermissionsString} permission
 */
export function hasPermissions(permissions: any, permission: PermissionsString): boolean {
  const perms = new PermissionsBitField(permissions);
  return perms.has(permission);
}
