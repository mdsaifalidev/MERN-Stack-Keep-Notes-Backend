import Note from "../model/Note.js";

const createNote = async (req, res) => {
  try {
    const uid = req.user.id;
    const { title, description } = req.body;

    await Note.create({ uid, title, description });
    return res.status(201).json({
      success: true,
      message: "Your note has been created successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const fetchNotes = async (req, res) => {
  try {
    const uid = req.user.id;
    const note = await Note.find({ uid }).select("title description");

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchNote = async (req, res) => {
  try {
    const uid = req.user.id;
    const _id = req.params.id;

    const note = await Note.findOne({ _id, uid }).select("title description");
    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    await Note.findByIdAndUpdate(id, { title, description }, { new: true });
    return res.status(200).json({
      success: true,
      message: "Your note has been updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const deleteNote = async (req, res) => {
  try {
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
      return res
        .status(404)
        .json({ success: false, message: "Note not found." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createNote, fetchNotes, fetchNote, updateNote, deleteNote };
