const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Prisma = require("../../config/index");
const generateCustomId = require("../../middlewares/customId");
const mailer = require("../../lib/nodemailer");

const UserModel = {
  async getAllUsers() {
    try {
      const results = await Prisma.users.findMany();
      const count = await Prisma.users.count();
      const removePasswordData = results.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return { count, results: removePasswordData };
    } catch (err) {
      console.log("error in getAllUsers :>> ", err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  },

  async getUserById(id) {
    try {
      const userExist = await Prisma.users.findUnique({
        where: {
          id: id,
        },
      });

      if (!userExist) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      const result = await Prisma.users.findUnique({
        where: { id },
      });
      const { password, ...userWithoutPassword } = result;
      return userWithoutPassword;
    } catch (err) {
      console.log("error in getUserById :>> ", err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  },

  async userCreate(data) {
    let newUser;

    const emailExist = await Prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    const phoneExist = await Prisma.users.findFirst({
      where: {
        phone: data.phone,
      },
    });

    try {
      const genid = await generateCustomId();

      if (!data || !data.name || !data.email || !data.password) {
        return {
          status: 400,
          message: "Missing input",
        };
      }
      if (emailExist || phoneExist) {
        return {
          status: 400,
          message: "Email or phone already exist",
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const { password, ...restData } = data;

      newUser = await Prisma.users.create({
        data: {
          id: genid,
          password: hashedPassword,
          ...restData,
        },
      });
      const { password: savedPassword, ...userWithoutPassword } = newUser;

      const verificationLink = `${process.env.APP_URL}/auth/verify/${genid}`;
      await mailer({
        subject: `Welcome to My App`,
        html: `<h1>Click here to verify your account</h1> <br/> <a href="${verificationLink}" target="_blank">Verify</a>`,
        to: newUser.email,
      });

      return userWithoutPassword;
    } catch (err) {
      console.log("error in userCreate :>> ", err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  },

  async userUpdate(id, token, data) {
    const userExist = await Prisma.users.findUnique({
      where: { id },
    });
    const emailExist = await Prisma.users.findFirst({
      where: {
        email: data.email,
        id: {
          not: id,
        },
      },
    });
    const phoneExist = await Prisma.users.findFirst({
      where: {
        phone: data.phone,
        id: {
          not: id,
        },
      },
    });

    try {
      if (!data) {
        return { status: 400, message: "Missing input" };
      }
      if (!userExist) {
        return { status: 404, message: "User not found" };
      }
      if (emailExist || phoneExist) {
        return { status: 400, message: "Email or phone already exist" };
      }
      if (userExist.id !== token.id) {
        return { status: 403, message: "You are not authorized to update" };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await Prisma.users.update({
        where: { id },
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = result;

      return userWithoutPassword;
    } catch (err) {
      console.log("error in userUpdate :>> ", err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  },

  async userVerify(id) {
    const userExist = await Prisma.users.findUnique({
      where: { id },
    });
    try {
      if (!userExist) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      const result = await Prisma.users.update({
        where: { id },
        data: { verified: true },
      });
      return result;
    } catch (err) {
      console.log("error in userVerify :>> ", err.message);
      return { status: 500, message: err.message };
    }
  },

  async forgotPassword(email) {
    const userExist = await Prisma.users.findFirst({
      where: { email },
    });

    try {
      if (!userExist) {
        return { status: 404, message: "Email not found" };
      }

      const resetLink = `${process.env.APP_URL}/reset-password/${userExist.id}`;
      await mailer({
        to: userExist.email,
        subject: "Reset your password",
        html: `<a href="${resetLink}">Click here to reset your password</a>`,
      });

      return { status: 200, message: "Reset link sent" };
    } catch (err) {
      console.log("error in forgotPassword :>> ", err.message);
      return { status: 500, message: err.message };
    }
  },

  async resetPassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await Prisma.users.update({
        where: { id },
        data: { password: hashedPassword },
      });
      return {
        status: 200,
        message: "Password reset successful",
        data: result,
      };
    } catch (err) {
      console.log("error in resetPassword :>> ", err.message);
      return { status: 500, message: err.message };
    }
  },

  async userLogin(data) {
    try {
      const user = await Prisma.users.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        return { status: 404, message: "User not found" };
      }

      if (!user.verified) {
        return { status: 403, message: "User is not verified" };
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        return { status: 400, message: "Wrong email or password" };
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password: _, ...userWithoutPassword } = user;

      return { token, user: userWithoutPassword };
    } catch (err) {
      console.log("error in userLogin :>> ", err.message);
      return { status: 500, message: err.message };
    }
  },
};

module.exports = UserModel;
