import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as coursesService     from "../../../services/courses.service";
import * as enrollmentsService from "../../../services/enrollments.service";
import * as qaService          from "../../../services/qa.service";
import * as analyticsService   from "../../../services/analytics.service";
import * as marketersService   from "../../../services/marketers.service";

// ── Queries ──────────────────────────────────────────────────────────────────

export const useInstructorCourses = (instructorId) =>
  useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn:  () => coursesService.getCourses(instructorId),
    enabled:  !!instructorId,
  });

export const useInstructorRequests = (instructorId) =>
  useQuery({
    queryKey: ["instructor-requests", instructorId],
    queryFn:  () => enrollmentsService.getRequests(instructorId),
    enabled:  !!instructorId,
  });

export const useInstructorQA = (instructorId) =>
  useQuery({
    queryKey: ["instructor-qa", instructorId],
    queryFn:  () => qaService.getQA(instructorId),
    enabled:  !!instructorId,
  });

export const useMarketerAssignments = (instructorId) =>
  useQuery({
    queryKey: ["marketer-assignments", instructorId],
    queryFn:  () => marketersService.getMarketerAssignments(instructorId),
    enabled:  !!instructorId,
  });

export const useAllCourseViews = () =>
  useQuery({
    queryKey: ["course-views-all"],
    queryFn:  () => analyticsService.getAllCourseViews(),
    staleTime: 1000 * 60 * 2, // refresh views every 2 min
  });

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateCourse = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => coursesService.createCourse(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["instructor-courses", instructorId] }),
  });
};

export const useUpdateCourse = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => coursesService.updateCourse(id, updates),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["instructor-courses", instructorId] }),
  });
};

export const useUpdateRequest = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => enrollmentsService.updateRequest(id, updates),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["instructor-requests", instructorId] }),
  });
};

export const useReplyQA = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }) => qaService.replyQA(id, answer),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["instructor-qa", instructorId] }),
  });
};

export const useCreateAssignment = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => marketersService.createAssignment(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["marketer-assignments", instructorId] }),
  });
};

export const useDeleteAssignment = (instructorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => marketersService.deleteAssignment(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["marketer-assignments", instructorId] }),
  });
};
