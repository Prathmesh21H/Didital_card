import { UserModel } from "../models/userModel.js";

/**
 * Create or Update User Profile
 */
export const upsertUser = async (req, res) => {
  try {
    const uid = req.user.uid; // 🔐 from Firebase token

    const {
      profileUrl,
      fullName,
      designation,
      company,
      bio,
      phone,
      email,
      website,
      linkedin,
      twitter,
      instagram,
      facebook,
    } = req.body;

    const existingUser = await UserModel.findByUid(uid);

    if (!existingUser) {
      const newUser = await UserModel.create(uid, {
        profileUrl,
        fullName,
        designation,
        company,
        bio,
        phone,
        email,
        website,
        linkedin,
        twitter,
        instagram,
        facebook,
      });

      return res.status(201).json({
        newUser: true,
        user: newUser,
      });
    }

    const updatedUser = await UserModel.update(uid, {
      profileUrl,
      fullName,
      designation,
      company,
      bio,
      phone,
      website,
      linkedin,
      twitter,
      instagram,
      facebook,
    });

    return res.status(200).json({
      newUser: false,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upsert User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetch User Profile
 */
export const getUser = async (req, res) => {
  const uid = req.user.uid;

  const user = await UserModel.findByUid(uid);

  if (!user) {
    return res.status(404).json({
      userExists: false,
      message: "User does not exist",
    });
  }

  res.status(200).json({
    userExists: true,
    user,
  });
};
