"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  applicants: "Applicants",
  analytics: "Analytics",
  settings: "Settings",
  post: "Post Job",
  edit: "Edit",
  messages: "Messages",
  profile: "Profile",
};

function formatSegment(segment: string): string {
  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = formatSegment(segment);

    return { href, label, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="font-black">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={crumb.href}
                  className="font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
