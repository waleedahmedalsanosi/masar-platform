import { useQuery, useMutation, useQueryClient } from "../../../lib/query.jsx";
import * as usersService       from "../../../services/users.service";
import * as coursesService     from "../../../services/courses.service";
import * as enrollmentsService from "../../../services/enrollments.service";
import * as analyticsService   from "../../../services/analytics.service";

export const useAllUsers = () =>
  useQuery({ queryKey: ["admin-users"],    queryFn: usersService.getAllUsers });

export const useAllCourses = () =>
  useQuery({ queryKey: ["admin-courses"],  queryFn: coursesService.getAllCourses });

export const useAllRequests = () =>
  useQuery({ queryKey: ["admin-requests"], queryFn: enrollmentsService.getAllRequests });

export const useAllViews = () =>
  useQuery({ queryKey: ["admin-views"],    queryFn: analyticsService.getAllCourseViews, staleTime: 1000 * 60 * 2 });

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => usersService.updateUser(id, { role }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersService.deleteUser(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};
