import { Router } from "express";
import * as Note from "../controller/Note.js";
import validate from "../middlewares/Validate.js";
import * as Validator from "../validators/Note.js";

const router = Router();

router
  .post("/", validate(Validator.createNoteSchema), Note.createNote)
  .get("/", Note.fetchNotes)
  .get("/:id", Note.fetchNote)
  .put("/:id", validate(Validator.updateNoteSchema), Note.updateNote)
  .delete("/:id", Note.deleteNote);

export default router;
