import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@lbbticket/common';

const router = express.Router();

router.post('/api/orders', requireAuth, validateRequest, async (req: Request, res: Response) => {});

export { router as createOrder };
