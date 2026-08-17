import * as store from "../models/store.js";
function hasOwn(o, k) {
  return Object.prototype.hasOwnProperty.call(o, k);
}
export function validateExamPayload(body, partial = false) {
  const errors = [];
  if (!partial || hasOwn(body, "title")) {
    if (typeof body.title !== "string" || !body.title.trim())
      errors.push("title is required");
  }
  if (!partial || hasOwn(body, "durationMinutes")) {
    if (
      typeof body.durationMinutes !== "number" ||
      !Number.isFinite(body.durationMinutes) ||
      body.durationMinutes <= 0
    )
      errors.push("durationMinutes must be a positive number");
  }
  return errors;
}
export function createExam(req, res) {
  const errors = validateExamPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const exam = store.createExam({
    title: req.body.title.trim(),
    durationMinutes: req.body.durationMinutes,
    isAvailable: req.body.isAvailable,
    createdBy: req.user?.id,
  });
  return res.status(201).json(exam);
}
export function listExams(req, res) {
  return res.json({ data: store.listExams().map(store.sanitizeExam) });
}
export function getExam(req, res) {
  const exam = store.getExam(req.params.examId);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  return res.json(store.sanitizeExam(exam));
}
export function updateExam(req, res) {
  const existing = store.getExam(req.params.examId);
  if (!existing) return res.status(404).json({ message: "Exam not found" });
  if (!store.canManageExamResource(req.user, existing.id))
    return res.status(403).json({
      message: "Only the owning examiner or an admin can modify this exam",
    });
  const errors = validateExamPayload(req.body, true);
  if (errors.length) return res.status(400).json({ errors });
  const updates = {};
  if (hasOwn(req.body, "title")) updates.title = req.body.title.trim();
  if (hasOwn(req.body, "durationMinutes"))
    updates.durationMinutes = req.body.durationMinutes;
  if (hasOwn(req.body, "isAvailable"))
    updates.isAvailable = Boolean(req.body.isAvailable);
  const exam = store.updateExam(req.params.examId, updates);
  return res.json(exam);
}
export function deleteExam(req, res) {
  const existing = store.getExam(req.params.examId);
  if (!existing) return res.status(404).json({ message: "Exam not found" });
  if (!store.canManageExamResource(req.user, existing.id))
    return res.status(403).json({
      message: "Only the owning examiner or an admin can delete this exam",
    });
  const exam = store.deleteExam(req.params.examId);
  return res.status(204).send();
}
