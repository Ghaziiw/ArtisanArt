/**
 * Enum representing various permissions in the system.
 */
export enum Permission {
  // Products
  PRODUCTS_VIEW = 'products:view',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',

  // Orders
  ORDERS_VIEW = 'orders:view',
  ORDERS_VIEW_ALL = 'orders:view:all',
  ORDERS_CREATE = 'orders:create',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_CANCEL = 'orders:cancel',

  // Users
  USERS_VIEW = 'users:view',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_CREATE = 'users:create',

  // Statistics
  STATS_VIEW = 'stats:view',

  // Admin Panel
  ADMIN_PANEL = 'admin:panel',

  CRAFTSMAN_UPDATE = 'craftsman:update',
  CRAFTSMAN_DELETE = 'craftsman:delete',
  CRAFTSMAN_UPDATE_EXP = 'craftsman:update:exp',
}

/**
 * Type representing user roles in the system.
 */
export type UserRole = 'admin' | 'artisan' | 'client';

/**
 * Mapping of user roles to their associated permissions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  client: [
    Permission.PRODUCTS_VIEW,
    Permission.ORDERS_VIEW,
    Permission.ORDERS_CREATE,
    Permission.ORDERS_CANCEL,
  ],
  artisan: [
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.ORDERS_VIEW_ALL,
    Permission.ORDERS_UPDATE,
    Permission.STATS_VIEW,
  ],
  admin: [
    Permission.ADMIN_PANEL,
    Permission.USERS_VIEW,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.ORDERS_VIEW_ALL,
    Permission.ORDERS_UPDATE,
    Permission.STATS_VIEW,
    Permission.CRAFTSMAN_UPDATE,
    Permission.CRAFTSMAN_DELETE,
    Permission.CRAFTSMAN_UPDATE_EXP,
    Permission.USERS_CREATE,
  ],
};
