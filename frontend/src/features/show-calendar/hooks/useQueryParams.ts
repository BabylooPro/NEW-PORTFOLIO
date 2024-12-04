import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// HOOK TO HANDLE QUERY PARAMS
export function useQueryParams() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	// UPDATE QUERY PARAMS
	const setQueryParams = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());

			// UPDATE OR DELETE QUERY PARAMS
			Object.entries(updates).forEach(([key, value]) => {
				if (value === null) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			});

			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname]
	);

	// GET QUERY PARAM
	const getQueryParam = useCallback(
		(key: string) => {
			return searchParams.get(key);
		},
		[searchParams]
	);

	// DELETE QUERY PARAMS
	const deleteQueryParams = useCallback(
		(keys: string[]) => {
			const params = new URLSearchParams(searchParams.toString());
			keys.forEach((key) => params.delete(key));
			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname]
	);

	return {
		setQueryParams,
		getQueryParam,
		deleteQueryParams,
		searchParams,
	};
}
