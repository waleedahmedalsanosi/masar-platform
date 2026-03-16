import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as coursesService     from "../../../services/courses.service";
import * as enrollmentsService from "../../../services/enrollments.service";

export const useCenterCourses = (centerId) =>
  useQuery({
    queryKey: ["center-courses", centerId],
    queryFn:  () => coursesService.getCourses(centerId),
    enabled:  !!centerId,
  });

export const useCenterRequests = (centerId) =>
  useQuery({
    queryKey: ["center-requests", centerId],
    queryFn:  () => enrollmentsService.getRequests(centerId),
    enabled:  !!centerId,
  });

export const useUpdateCenterCourse = (centerId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => coursesService.updateCourse(id, updates),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["center-courses", centerId] }),
  });
};

export const useUpdateCenterRequest = (centerId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => enrollmentsService.updateRequest(id, updates),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["center-requests", centerId] }),
  });
};
