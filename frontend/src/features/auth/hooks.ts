import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { login, register, logout, ApiError } from "./api";
import { authKeys, sessionQueryOptions } from "./query";

type ErrorShape = ApiError | Error;

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: async (result) => {
            await queryClient.invalidateQueries({ queryKey: authKeys.session() });
            if (result.redirect && result.redirectTo) {
                window.location.href = result.redirectTo;
                return;
            }
            await queryClient.ensureQueryData(sessionQueryOptions());
            void navigate({ to: "/" });
        }
    });
};

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKeys.session() });
            await queryClient.ensureQueryData(sessionQueryOptions());
            void router.navigate({ to: "/" });
        }
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKeys.session() });
            queryClient.removeQueries({ queryKey: authKeys.session() });
        },
        onError: (error: ErrorShape) => {
            console.error("Failed to logout", error);
        }
    });
};
