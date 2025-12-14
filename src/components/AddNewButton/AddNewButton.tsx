import React from "react";
//import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui-elements/button";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type AddNewButtonProps = {
    href: string;
    toolTipText: string;
    className?: string;
};

export default function AddNewButton({ href, toolTipText, className }: AddNewButtonProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                    <TooltipTrigger>
                        <Link href={href}>
                            <Button
                                label={toolTipText}
                                icon={<Plus className="" />}
                                variant="dark"
                                shape="rounded"
                                size="medium"
                            />
                        </Link>
                    </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    );
}