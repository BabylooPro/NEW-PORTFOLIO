import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const DEBUG_STORAGE_KEY = "debug_borders_enabled";

export const useHeaderLogic = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolling, setIsScrolling] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showWIPBadge, setShowWIPBadge] = useState(true);
    const [lastCommitInfo, setLastCommitInfo] = useState<{
        date: string;
        message: string;
        hiddenDate: string;
    } | null>(null);
    const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
    const [showDebugButton, setShowDebugButton] = useState(() => {
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem(DEBUG_STORAGE_KEY) === "true" ||
                process.env.NODE_ENV === "development"
            );
        }
        return false;
    });

    const fetchLastCommitInfo = async () => {
        try {
            // ARRAYS OF EXCLUDED TERMS
            const excludedTerms = ["README.md", "TODO.md", "CHANGELOG.md", "LICENSE"];
            // REGEX PATTERN FOR WORKFLOW ENTRIES THAT HAVE PREFIXES LIKE "added(workflow):" OR "modified(workflow):"
            const workflowPattern = /\w+\(workflow\):/i;
            // REGEX PATTERN FOR SYNC BRANCH COMMITS
            const syncBranchPattern = /^SYNC FRONTEND FOLDER FROM (MAIN|PREVIEW) BRANCH$/i;

            // FETCH MORE COMMITS TO ALLOW FILTERING
            const response = await fetch(
                "https://api.github.com/repos/BabylooPro/NEW-PORTFOLIO/commits?per_page=10"
            );
            const commits = await response.json();

            // FILTER COMMITS THAT DON'T CONTAIN EXCLUDED TERMS
            let filteredCommit = null;
            for (const commit of commits) {
                const commitMessage = commit.commit.message.split("\n")[0];
                const containsExcludedTerm = excludedTerms.some(term =>
                    commitMessage.toLowerCase().includes(term.toLowerCase())
                );
                const isWorkflowCommit = workflowPattern.test(commitMessage);
                const isSyncBranchCommit = syncBranchPattern.test(commitMessage);

                // IF THE COMMIT DOESN'T CONTAIN AN EXCLUDED TERM, ISN'T A WORKFLOW COMMIT, AND ISN'T A SYNC BRANCH COMMIT, ADD IT TO THE FILTERED COMMIT
                if (!containsExcludedTerm && !isWorkflowCommit && !isSyncBranchCommit) {
                    filteredCommit = commit;
                    break;
                }
            }

            // USE THE FIRST VALID COMMIT OR FALLBACK TO THE VERY FIRST ONE IF ALL ARE EXCLUDED
            const latestCommit = filteredCommit || commits[0];

            const commitDate = new Date(latestCommit.commit.author.date);
            const currentDate = new Date();
            const daysSinceLastCommit = Math.floor(
                (currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            const isRecent = daysSinceLastCommit <= 60;
            const daysUntilHidden = Math.max(60 - daysSinceLastCommit, 0);
            const hiddenDate = new Date(commitDate.getTime() + 60 * 24 * 60 * 60 * 1000);

            const dateTimeFormat = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Zurich",
            } as const;
            const formattedCommitDate = commitDate.toLocaleString("fr-CH", dateTimeFormat);
            const formattedHiddenDate = hiddenDate.toLocaleString("fr-CH", dateTimeFormat);

            return {
                date: formattedCommitDate,
                message: latestCommit.commit.message.split("\n")[0],
                isRecent,
                daysUntilHidden,
                hiddenDate: formattedHiddenDate,
            };
        } catch (error) {
            console.error("Failed to fetch last commit info", error);
            return null;
        }
    };

    const handleBackNavigation = () => {
        const pathSegments = pathname.split("/").filter((segment) => segment !== "");
        if (pathSegments.length > 1) {
            const parentPath = "/" + pathSegments.slice(0, -1).join("/");
            router.push(parentPath);
        } else {
            router.push("/");
        }
    };

    const getPreviousPageTitle = () => {
        const pathSegments = pathname.split("/").filter((segment) => segment !== "");
        if (pathSegments.length > 1) {
            return (
                pathSegments[pathSegments.length - 2].charAt(0).toUpperCase() +
                pathSegments[pathSegments.length - 2].slice(1)
            );
        }
        return "Home";
    };

    const toggleDebugBorders = useCallback(() => {
        document.documentElement.classList.toggle("debug-borders");
        const isDebugEnabled = document.documentElement.classList.contains("debug-borders");
        localStorage.setItem(DEBUG_STORAGE_KEY, isDebugEnabled.toString());
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchLastCommitInfo().then((info) => {
            if (info) {
                setLastCommitInfo(info);
                setShowWIPBadge(info.isRecent);
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setShowDebugButton(process.env.NODE_ENV === "development");
    }, []);

    useEffect(() => {
        setIsClient(true);

        const handleResize = () => {
            if (!hasScrolledOnce) {
                setIsCompact(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        let scrollTimeout: NodeJS.Timeout;
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const isMobile = window.innerWidth < 640;
            const currentScrollY = window.scrollY;

            if (!hasScrolledOnce && currentScrollY > 0) {
                setHasScrolledOnce(true);
            }

            if (currentScrollY > lastScrollY) {
                setIsScrolling(true);
                if (!isMobile) {
                    setIsCompact(true);
                }
            } else if (currentScrollY < lastScrollY) {
                setIsScrolling(true);
                if (!isMobile) {
                    setIsCompact(true);
                }
            }

            lastScrollY = currentScrollY;

            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
                if (currentScrollY === 0 && !hasScrolledOnce) {
                    setIsCompact(false);
                }
            }, 150);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            clearTimeout(scrollTimeout);
        };
    }, [hasScrolledOnce]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDebugEnabled = localStorage.getItem(DEBUG_STORAGE_KEY) === "true";
            if (isDebugEnabled) {
                document.documentElement.classList.add("debug-borders");
            }
        }
    }, []);

    return {
        isScrolling,
        isClient,
        isCompact,
        isLoading,
        showWIPBadge,
        lastCommitInfo,
        showDebugButton,
        pathname,
        handleBackNavigation,
        getPreviousPageTitle,
        toggleDebugBorders,
    };
}; 
