import { Request, Response } from 'express';
import User from '../models/userModel.js';
import Link from '../models/linkModel.js';
import { StatusCodes } from 'http-status-codes';

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const { bio, displayName, profilePicture } = req.body;

    // Create an update object with only the fields that were provided
    const updateFields: {
      bio?: string;
      username?: string;
      profilePicture?: string;
    } = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (displayName !== undefined) updateFields.username = displayName;
    if (profilePicture !== undefined)
      updateFields.profilePicture = profilePicture;

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
    }).select('-password');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    console.log('checkAuth called with user:', req.user?._id);
    if (!req.user || !req.user._id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User not authenticated' });
    }

    const user = await User.findOne({ _id: req.user._id }).select('-password');
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    console.log('User found:', user.username);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error in checkAuth:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    }).select('-password -email');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    const links = await Link.find({ createdBy: user._id });

    res.status(StatusCodes.OK).json({
      user: {
        _id: user._id,
        username: user.username,
        bio: user.bio || '',
      },
      links,
    });
  } catch (error) {
    console.error('Error in getPublicProfile:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};
