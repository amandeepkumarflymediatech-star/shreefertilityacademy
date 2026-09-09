// This is a temporary polyfill during the Sequelize migration.
// Once all files are migrated to Sequelize, this file can be deleted again.
export const prisma = new Proxy({}, {
  get: function(target, prop) {
    return new Proxy({}, {
      get: function(t, p) {
        return () => {
          console.error(`Attempted to call prisma.${String(prop)}.${String(p)} but Prisma is uninstalled! Migrate this file to Sequelize.`);
          if (p === 'findUnique' || p === 'findFirst') return null;
          return [];
        }
      }
    });
  }
}) as any;
