const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const createModification = require("../../utils/createModification");

module.exports = async (parent, { email, password, modifications }, ctx) => {
  const user = await ctx.prisma.user.findOne({ where: { email } });
  const recipeModsCreated = [];
  const recipeModsInConflict = [];
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }

  const passwordValid = await compare(password, user.password);
  if (!passwordValid) {
    throw new Error("Invalid password");
  }

  if (modifications) {
    await Promise.all(
      modifications.map(async ({ recipeId, ...modification }) => {
        const modExists = Boolean(
          await ctx.prisma.modification.count({
            where: {
              user: { id: user.id },
              recipe: { uid: recipeId },
            },
          })
        );
        if (!modExists) {
          await createModification(ctx, recipeId, user.id, modification);
          recipeModsCreated.push(recipeId);
        } else {
          recipeModsInConflict.push(recipeId);
        }
      })
    );
  }

  const token = sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user,
    recipeModsCreated,
    recipeModsInConflict,
  };
};
