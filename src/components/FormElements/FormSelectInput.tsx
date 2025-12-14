"use client";

import AddNewButton from "@/components/AddNewButton/AddNewButton";
import React from "react";
import { Select as SelectBtn } from "@/components/FormElements/select";
import { Option, Options } from "react-tailwindcss-select/dist/components/type";
import { useId } from "react";

type FormSelectInputProps = {
    className?: string;
    options: Options;
    label: string;
    option: Option | null;
    setOption: (option: Option | null) => void;
    href?: string;
    labelShown?: boolean;
    toolTipText?: string;
};

export default function FormSelectInput({
    className,
    options,
    label,
    option,
    setOption,
    href,
    toolTipText,
    labelShown = true,
}: FormSelectInputProps) {
    const id = useId();

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
                <SelectBtn
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
                    placeholder={"Select " + label.toLowerCase()}
                    className="w-full xl:w-1/2"
                    searchable={true}
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