import { useQuery, useQueryClient } from "../../../lib/query.jsx";
import * as marketersService   from "../../../services/marketers.service";
import * as enrollmentsService from "../../../services/enrollments.service";

export const useMyAssignments = (marketerId) =>
  useQuery({
    queryKey: ["my-assignments", marketerId],
    queryFn:  () => marketersService.getMyAssignments(marketerId),
    enabled:  !!marketerId,
  });

export const useMarketerRequests = (marketerId) =>
  useQuery({
    queryKey: ["marketer-requests", marketerId],
    queryFn:  () => enrollmentsService.getMarketerRequests(marketerId),
    enabled:  !!marketerId,
  });

export const useMarketerData = (marketerId) => {
  const assignments = useMyAssignments(marketerId);
  const referrals   = useMarketerRequests(marketerId);
  const qc          = useQueryClient();

  const reload = () => {
    qc.invalidateQueries({ queryKey: ["my-assignments",    marketerId] });
    qc.invalidateQueries({ queryKey: ["marketer-requests", marketerId] });
  };

  return {
    assignments: assignments.data ?? [],
    referrals:   referrals.data   ?? [],
    isLoading:   assignments.isLoading || referrals.isLoading,
    isError:     assignments.isError   || referrals.isError,
    reload,
  };
};
