import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { sendResponse, sendError } from '../utils/response';
import { generateReportSchema } from '../validators/reporting.validator';

export const generateReport = async (req: Request, res: Response) => {
  const { error, value } = generateReportSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);

  const exportRecord = await prisma.exportHistory.create({
    data: {
      userId: (req as unknown as { user?: { id: string } }).user?.id || 'SYSTEM',
      type: value.exportType,
      reportName: `${value.reportType}_${Date.now()}`,
      reportType: value.reportType,
      filters: value.filters,
      status: 'PENDING',
    },
  });

  // In a real scenario, this would be handled by a worker
  // For now, we process it and update the record
  try {
    await prisma.exportHistory.update({
      where: { id: exportRecord.id },
      data: { status: 'PROCESSING' },
    });

    // Simulate file generation and URL assignment
    const mockUrl = `https://storage.school.edu/reports/${exportRecord.reportName}.${value.exportType.toLowerCase()}`;

    await prisma.exportHistory.update({
      where: { id: exportRecord.id },
      data: {
        status: 'COMPLETED',
        fileUrl: mockUrl,
        fileSize: 102456, // 100KB mock
      },
    });

    return sendResponse(res, 200, true, 'Report generation started', {
      reportId: exportRecord.id,
      downloadUrl: mockUrl,
    });
  } catch (err: unknown) {
    const error = err as Error;
    await prisma.exportHistory.update({
      where: { id: exportRecord.id },
      data: { status: 'FAILED', error: error.message },
    });
    return sendError(res, 500, 'Failed to generate report');
  }
};

export const getExportHistory = async (req: Request, res: Response) => {
  const userId = (req as unknown as { user?: { id: string } }).user?.id || 'SYSTEM';
  const items = await prisma.exportHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return sendResponse(res, 200, true, 'Export history retrieved', items);
};
