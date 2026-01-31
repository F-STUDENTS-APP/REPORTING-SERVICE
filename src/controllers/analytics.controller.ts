import { Request, Response } from 'express';
import { sendResponse, sendError } from '../utils/response';

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    // In a real microservices env, we would aggregate from other services
    // Here we mock the aggregation or query our cache if we implement sync

    // Mocking aggregation results
    const summary = {
      totalViolations: 156,
      totalAchievements: 84,
      topOffendingClass: '11 IPA 2',
      topAchievingClass: '10 IPS 1',
      activeStudents: 1200,
      pointAverage: 85.5,
      averagePresenceRate: 94.2, // New: From schedule-service
    };

    return sendResponse(res, 200, true, 'Dashboard summary retrieved', summary);
  } catch (error: unknown) {
    return sendError(res, 500, (error as Error).message);
  }
};

export const getViolationTrends = async (_req: Request, res: Response) => {
  // Logic to fetch monthly distribution from violation-service and local cache
  const trends = [
    { month: '2024-01', count: 45 },
    { month: '2024-02', count: 38 },
    { month: '2024-03', count: 52 },
  ];
  return sendResponse(res, 200, true, 'Violation trends retrieved', trends);
};
export const getAttendanceTrends = async (_req: Request, res: Response) => {
  // Logic to fetch from schedule-service
  const trends = [
    { date: '2024-05-20', presenceRate: 96.5 },
    { date: '2024-05-21', presenceRate: 92.1 },
    { date: '2024-05-22', presenceRate: 94.8 },
  ];
  return sendResponse(res, 200, true, 'Attendance trends retrieved', trends);
};
