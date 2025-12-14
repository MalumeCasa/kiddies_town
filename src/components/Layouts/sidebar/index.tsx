"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    inert?: '' | boolean;
  }
}

// Define proper types for your navigation data
interface NavSubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
  items?: NavSubItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems((prev) => 
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }, []);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile, setIsOpen]);

  useEffect(() => {
    // Keep collapsible open when its subpage is active
    NAV_DATA.forEach((section: NavSection) => {
      section.items.forEach((item: NavItem) => {
        if (item.items && item.items.length > 0) {
          item.items.forEach((subItem: NavSubItem) => {
            if (subItem.url === pathname && !expandedItems.includes(item.title)) {
              setExpandedItems(prev => [...prev, item.title]);
            }
          });
        }
      });
    });
  }, [pathname, expandedItems]); // Added expandedItems to dependency array

  // Close sidebar when clicking on link in mobile view
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Helper function to get safe href
  const getSafeHref = (item: NavItem): string => {
    if ('url' in item && item.url) {
      return item.url;
    }
    // Fallback to generated path from title
    return `/${item.title.toLowerCase().split(" ").join("-")}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex flex-col border-r border-gray-300 bg-white transition-all duration-200 ease-linear dark:border-gray-700 dark:bg-gray-900",
          isMobile 
            ? "fixed inset-y-0 left-0 z-50 w-[290px] transform transition-transform duration-300" 
            : "sticky top-0 h-screen w-[290px]",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
        aria-label="Main navigation"
        aria-hidden={isMobile ? !isOpen : false}
      >
        <div className="flex h-full flex-col py-8 pl-6 pr-3">
          <div className="relative flex items-center justify-between pr-4">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="px-0 py-3"
            >
              <Logo />
              Logo goes here
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="size-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-8 flex-1 overflow-y-auto pr-3">
            {NAV_DATA.map((section: NavSection) => (
              <div key={section.label} className="mb-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-1">
                    {section.items.map((item: NavItem) => (
                      <li key={item.title}>
                        {item.items && item.items.length > 0 ? (
                          <div>
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200",
                                "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300",
                                "text-gray-800 dark:text-gray-200",
                                item.items.some(({ url }) => url === pathname) &&
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold"
                              )}
                            >
                              <item.icon
                                className="size-5 shrink-0"
                                aria-hidden="true"
                              />

                              <span className="flex-1 font-medium">{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto transition-transform duration-200 text-gray-500 dark:text-gray-400",
                                  expandedItems.includes(item.title)
                                    ? "rotate-0"
                                    : "rotate-180"
                                )}
                                aria-hidden="true"
                              />
                            </button>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-12 mt-1 space-y-1 pb-2"
                                role="menu"
                              >
                                {item.items.map((subItem: NavSubItem) => (
                                  <li key={subItem.title} role="none">
                                    <Link
                                      href={subItem.url}
                                      onClick={handleLinkClick}
                                      className={cn(
                                        "flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
                                        "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                                        "text-gray-700 dark:text-gray-300",
                                        pathname === subItem.url
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium border-l-2 border-blue-500"
                                          : ""
                                      )}
                                    >
                                      <span className="text-sm">{subItem.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={getSafeHref(item)}
                            onClick={handleLinkClick}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200",
                              "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300",
                              "text-gray-800 dark:text-gray-200",
                              pathname === getSafeHref(item)
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold"
                                : ""
                            )}
                          >
                            <item.icon
                              className="size-5 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}