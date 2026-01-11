"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: {
    base: "border-border hover:border-foreground/30",
    selected: "bg-foreground text-background border-foreground",
  },
  emerald: {
    base: "border-border hover:border-emerald-500/50",
    selected: "bg-emerald-500 text-white border-emerald-500",
  },
  blue: {
    base: "border-border hover:border-blue-500/50",
    selected: "bg-blue-500 text-white border-blue-500",
  },
  violet: {
    base: "border-border hover:border-violet-500/50",
    selected: "bg-violet-500 text-white border-violet-500",
  },
  orange: {
    base: "border-border hover:border-orange-500/50",
    selected: "bg-orange-500 text-white border-orange-500",
  },
} as const;

type FilterChipVariant = keyof typeof variantStyles;

interface FilterChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  variant?: FilterChipVariant;
  icon?: React.ReactNode;
  className?: string;
}

function FilterChip({
  label,
  selected,
  onToggle,
  variant = "default",
  icon,
  className,
}: FilterChipProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected ? styles.selected : styles.base,
        !selected && "bg-background",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
      animate={{
        backgroundColor: selected ? undefined : "var(--background)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {icon && (
        <motion.span
          className="flex items-center justify-center"
          initial={false}
          animate={{
            scale: selected ? 1.1 : 1,
            rotate: selected ? 5 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
        >
          {icon}
        </motion.span>
      )}
      <span>{label}</span>
      <motion.span
        className="flex items-center justify-center"
        initial={false}
        animate={{
          width: selected ? "auto" : 0,
          opacity: selected ? 1 : 0,
          marginLeft: selected ? 0 : -6,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      </motion.span>
    </motion.button>
  );
}

export { FilterChip, type FilterChipProps, type FilterChipVariant };
