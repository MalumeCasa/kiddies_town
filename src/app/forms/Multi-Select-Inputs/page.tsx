"use client";

import AddNewButton from "@/components/AddNewButton/AddNewButton";
import React from "react";
import MultiSelect from "@/components/FormElements/MultiSelect/MultiSelect";
import { Option, Options } from "react-tailwindcss-select/dist/components/type";

import { useId } from "react";

// Page component without custom props
export default function MultiSelectInputsPage() {
    const id = useId();
    
    // You'll need to manage these states or get them from context/API
    const [option, setOption] = React.useState<Option | null>(null);
    const [options, setOptions] = React.useState<Options>([]);
    const label = "Your Label"; // Define your label
    const className = ""; // Define your className
    const href = ""; // Define your href
    const toolTipText = ""; // Define your tooltip text

    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="text-body-sm font-medium text-dark dark:text-white"
            >
                {label}
                {<span className="mb-4.5 ml-1 select-none text-red">*</span>}
            </label>
            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row space-y-2.5">
                <MultiSelect
                    id="Parent-Multi-Select"
                    label=""
                    items={
                        Array.isArray(options)
                            ? options.filter(
                                (item): item is Option =>
                                    "value" in item && "label" in item && typeof (item as Option).value === "string" && typeof (item as Option).label === "string"
                            )
                            : []
                    }
                    defaultValue={option ? option.value : ""}
                    className="w-full xl:w-1/2"
                    placeholder={"Select " + label.toLowerCase()}
                />

                {(
                    <AddNewButton 
                    toolTipText={toolTipText + ""} 
                    href={href + ""}
                    />
                )}
            </div>
        </div>
    );
}