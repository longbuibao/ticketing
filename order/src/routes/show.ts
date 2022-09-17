import express, { Request, Response } from 'express';

import { NotFoundError, requireAuth } from '@lbbticket/common';

const router = express.Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {});

export { router as showOrderRouter };
