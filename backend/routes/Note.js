import { Router } from "express";
import * as Note from "../controller/Note.js";

const router = Router();

router
  .post("/", Note.createNote)
  .get("/", Note.fetchNotes)
  .get("/:id", Note.fetchNote)
  .put("/:id", Note.updateNote)
  .delete("/:id", Note.deleteNote);

export default router;
