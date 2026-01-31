import Joi from 'joi';

export const generateReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(
      'VIOLATION_SUMMARY',
      'ACHIEVEMENT_SUMMARY',
      'STUDENT_INDIVIDUAL_REPORT',
      'CLASS_PERFORMANCE'
    )
    .required(),
  exportType: Joi.string().valid('PDF', 'EXCEL', 'CSV').required(),
  filters: Joi.object({
    academicYear: Joi.string()
      .pattern(/^\d{4}\/\d{4}$/)
      .optional(),
    semester: Joi.number().valid(1, 2).optional(),
    classId: Joi.string().uuid().optional(),
    studentId: Joi.string().uuid().optional(),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().optional(),
  }).required(),
});

export const analyticsQuerySchema = Joi.object({
  academicYear: Joi.string()
    .pattern(/^\d{4}\/\d{4}$/)
    .optional(),
  semester: Joi.number().valid(1, 2).optional(),
  classId: Joi.string().uuid().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
