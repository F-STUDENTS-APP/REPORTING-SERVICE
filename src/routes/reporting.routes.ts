import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import * as reportController from '../controllers/report.controller';

const router = Router();

// Analytics & Dashboard
router.get('/dashboard/summary', analyticsController.getDashboardSummary);
router.get('/trends/violations', analyticsController.getViolationTrends);
router.get('/trends/attendance', analyticsController.getAttendanceTrends);

// Report Generation
router.post('/generate', reportController.generateReport);
router.get('/history', reportController.getExportHistory);

export default router;
