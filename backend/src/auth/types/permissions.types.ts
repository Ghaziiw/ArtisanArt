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
  CRAFTSMAN_ORDERS_VIEW = 'orders:craftsman:view',
  ORDERS_UPDATE_STATUS = 'orders:update:status',

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
  CATEGORIES_CREATE = 'categories:create',
  CATEGORIES_UPDATE = 'categories:update',
  CATEGORIES_DELETE = 'categories:delete',
  OFFERS_CREATE = 'offers:create',
  OFFERS_UPDATE = 'offers:update',
  OFFERS_DELETE = 'offers:delete',
  MANAGE_SHOPPING_CART = 'shoppingcart:manage',
  ADMIN_USER_CREATE = 'admin:users:create',
  CRAFTSMAN_VIEW = 'craftsman:view',
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
    Permission.MANAGE_SHOPPING_CART,
  ],
  artisan: [
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.ORDERS_VIEW_ALL,
    Permission.ORDERS_UPDATE,
    Permission.STATS_VIEW,
    Permission.OFFERS_CREATE,
    Permission.OFFERS_UPDATE,
    Permission.OFFERS_DELETE,
    Permission.MANAGE_SHOPPING_CART,
    Permission.CRAFTSMAN_ORDERS_VIEW,
    Permission.ORDERS_UPDATE_STATUS,
  ],
  admin: [
    Permission.ADMIN_PANEL,
    Permission.USERS_VIEW,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.ORDERS_VIEW_ALL,
    Permission.ORDERS_UPDATE,
    Permission.STATS_VIEW,
    Permission.CRAFTSMAN_UPDATE,
    Permission.CRAFTSMAN_DELETE,
    Permission.CRAFTSMAN_UPDATE_EXP,
    Permission.USERS_CREATE,
    Permission.CATEGORIES_CREATE,
    Permission.CATEGORIES_UPDATE,
    Permission.CATEGORIES_DELETE,
    Permission.ADMIN_USER_CREATE,
    Permission.CRAFTSMAN_VIEW,
  ],
};
