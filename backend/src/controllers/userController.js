import { User } from '../models/User.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      throw new AppError('Name is required', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
