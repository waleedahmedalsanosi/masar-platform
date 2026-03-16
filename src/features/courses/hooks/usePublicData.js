import { useQuery } from "@tanstack/react-query";
import * as publicService from "../../../services/public.service";

export const usePublicCourses = () =>
  useQuery({
    queryKey: ["public-courses"],
    queryFn:  publicService.getPublicCourses,
    staleTime: 1000 * 60 * 10,
  });

export const usePublicCourseDetails = (id) =>
  useQuery({
    queryKey: ["public-course", id],
    queryFn:  () => publicService.getPublicCourseDetails(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 10,
  });

export const usePublicInstructors = () =>
  useQuery({
    queryKey: ["public-instructors"],
    queryFn:  publicService.getInstructors,
    staleTime: 1000 * 60 * 10,
  });

export const usePublicInstructorDetails = (id) =>
  useQuery({
    queryKey: ["public-instructor", id],
    queryFn:  () => publicService.getInstructorDetails(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 10,
  });

export const usePublicCenters = () =>
  useQuery({
    queryKey: ["public-centers"],
    queryFn:  publicService.getCenters,
    staleTime: 1000 * 60 * 10,
  });
