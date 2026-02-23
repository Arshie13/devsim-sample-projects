import { Router } from 'express';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/member.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createMemberSchema, updateMemberSchema } from '../validators/member.validator.js';

const router = Router();

// GET /api/members
router.get('/', getAllMembers);

// GET /api/members/:id
router.get('/:id', getMemberById);

// POST /api/members
router.post('/', validateRequest(createMemberSchema), createMember);

// PUT /api/members/:id
router.put('/:id', validateRequest(updateMemberSchema), updateMember);

// DELETE /api/members/:id
router.delete('/:id', deleteMember);

export default router;
