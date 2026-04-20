import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./password";

export const ROOT_ADMIN_USERNAME = "admin";
export const ROOT_ADMIN_PASSWORD = "Tanviet@1234";
export const ROOT_ADMIN_RESET_EMAIL = "tanvietref@gmail.com";

const selectSafeUser = {
  id: true,
  username: true,
  email: true,
  recoveryEmail: true,
  role: true,
  isActive: true,
  isRoot: true,
  createdAt: true,
  updatedAt: true,
};

export const ensureRootAdminUser = async () => {
  await prisma.adminUser.updateMany({
    where: {
      role: {
        not: "admin",
      },
    },
    data: {
      role: "admin",
    },
  });

  const existingRoot = await prisma.adminUser.findFirst({
    where: {
      isRoot: true,
    },
  });

  if (existingRoot) {
    if (existingRoot.username !== ROOT_ADMIN_USERNAME) {
      const usernameTaken = await prisma.adminUser.findUnique({
        where: {
          username: ROOT_ADMIN_USERNAME,
        },
      });

      if (!usernameTaken) {
        return prisma.adminUser.update({
          where: {
            id: existingRoot.id,
          },
          data: {
            username: ROOT_ADMIN_USERNAME,
            isActive: true,
            role: "admin",
            recoveryEmail:
              existingRoot.recoveryEmail || ROOT_ADMIN_RESET_EMAIL,
          },
        });
      }
    }

    return existingRoot;
  }

  const existingByUsername = await prisma.adminUser.findUnique({
    where: {
      username: ROOT_ADMIN_USERNAME,
    },
  });

  if (existingByUsername) {
    return prisma.adminUser.update({
      where: {
        id: existingByUsername.id,
      },
      data: {
        isRoot: true,
        isActive: true,
        role: "admin",
        recoveryEmail:
          existingByUsername.recoveryEmail || ROOT_ADMIN_RESET_EMAIL,
      },
    });
  }

  return prisma.adminUser.create({
    data: {
      username: ROOT_ADMIN_USERNAME,
      email: ROOT_ADMIN_RESET_EMAIL,
      recoveryEmail: ROOT_ADMIN_RESET_EMAIL,
      passwordHash: hashPassword(ROOT_ADMIN_PASSWORD),
      role: "admin",
      isActive: true,
      isRoot: true,
    },
  });
};

export const getAdminUsers = async () => {
  await ensureRootAdminUser();

  return prisma.adminUser.findMany({
    select: selectSafeUser,
    orderBy: [{ isRoot: "desc" }, { createdAt: "asc" }],
  });
};

export const createAdminUser = async ({
  username,
  email,
  recoveryEmail,
  password,
  isActive,
}) => {
  return prisma.adminUser.create({
    data: {
      username,
      email,
      recoveryEmail,
      passwordHash: hashPassword(password),
      role: "admin",
      isActive,
      isRoot: false,
    },
    select: selectSafeUser,
  });
};

export const updateAdminUser = async (id, payload) => {
  const data = {
    username: payload.username,
    email: payload.email,
    recoveryEmail: payload.recoveryEmail,
    role: "admin",
    isActive: payload.isActive,
  };

  if (payload.password) {
    data.passwordHash = hashPassword(payload.password);
  }

  return prisma.adminUser.update({
    where: { id },
    data,
    select: selectSafeUser,
  });
};

export const deleteAdminUser = async (id) => {
  return prisma.adminUser.delete({
    where: { id },
  });
};

export const validateAdminLogin = async (email, password) => {
  await ensureRootAdminUser();

  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  const user = await prisma.adminUser.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return user;
};

export const findAdminUserById = async (id) =>
  prisma.adminUser.findUnique({
    where: { id },
    select: selectSafeUser,
  });
