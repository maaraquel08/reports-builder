import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and then processes them with tailwind-merge
 * to properly handle Tailwind CSS class conflicts.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
