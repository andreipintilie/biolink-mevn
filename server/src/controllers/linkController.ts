import { StatusCodes } from 'http-status-codes';
import Link from '../models/linkModel.js';
import User from '../models/userModel.js';
import { Request, Response } from 'express';

export const getCurrentUserLinks = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User not authenticated' });
    }

    const links = await Link.find({ createdBy: req.user._id });
    res.json(links);
  } catch (error) {
    console.error('Error in getCurrentUserLinks:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const createLink = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User not authenticated' });
    }

    req.body.createdBy = req.user._id;
    req.body.clicks = 0;

    const link = await Link.create(req.body);
    res.status(StatusCodes.CREATED).json({ link });
  } catch (error) {
    console.error('Error in createLink:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const updateLink = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.id;
    const updateData = req.body;

    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Link not found' });
    }

    if (link.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'Not authorized to update this link' });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      linkId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({
      msg: 'Link updated successfully',
      link: updatedLink,
    });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.id;

    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Link not found' });
    }

    if (link.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'Not authorized to delete this link' });
    }

    await Link.findByIdAndDelete(linkId);

    res.status(StatusCodes.OK).json({ msg: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const getLinksByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    const userId = user?._id;

    if (!userId) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    const links = await Link.find({ createdBy: userId });
    res.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const incrementClick = async (req: Request, res: Response) => {
  console.log(req.params.id);

  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Link not found' });
    }

    res.json({ link });
  } catch (error) {
    console.error('Error incrementing click:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};
