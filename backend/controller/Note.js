import Note from "../model/Note.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler";

const createNote = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const { title, description } = req.body;

  await Note.create({ uid, title, description });
  return res.status(201).json({
    success: true,
    message: "Your note has been created successfully.",
  });
});

const fetchNotes = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const note = await Note.find({ uid }).select("title description");

  return res.status(200).json({
    success: true,
    note,
  });
});

const fetchNote = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const _id = req.params.id;

  const note = await Note.findOne({ _id, uid }).select("title description");
  return res.status(200).json({
    success: true,
    note,
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  await Note.findByIdAndUpdate(id, { title, description }, { new: true });
  return res.status(200).json({
    success: true,
    message: "Your note has been updated successfully.",
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const _id = req.params.id;

  const note = await Note.findOne({ _id, uid });
  if (note) {
    await note.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Your note has been deleted successfully.",
    });
  } else {
    throw new CustomError("Note not found.", 400);
  }
});

export { createNote, fetchNotes, fetchNote, updateNote, deleteNote };
