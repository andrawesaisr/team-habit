import {
    queryOptions,
    type QueryClient,
    type UseQueryResult
} from "@tanstack/react-query";
import { getProfile, getSession } from "./api";

export const authKeys = {
    all: ["auth"] as const,
    session: () => [...authKeys.all, "session"] as const,
    profile: () => [...authKeys.all, "profile"] as const
};

export const sessionQueryOptions = () =>
    queryOptions({
        queryKey: authKeys.session(),
        queryFn: getSession,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30
    });

export const profileQueryOptions = () =>
    queryOptions({
        queryKey: authKeys.profile(),
        queryFn: getProfile,
        enabled: false
    });

export const ensureSession = async (queryClient: QueryClient) =>
    queryClient.ensureQueryData(sessionQueryOptions());

export type SessionQueryResult = UseQueryResult<
    Awaited<ReturnType<typeof getSession>>
>;
