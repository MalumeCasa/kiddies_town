"use client";

import { useState } from "react";
import FormSelectInput from "@/components/FormElements/FormSelectInput";
import { Option } from "react-tailwindcss-select/dist/components/type";

export default function SelectInputsPage() {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  
  // Example options - replace with your actual data
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Select Inputs</h1>
      
      <FormSelectInput
        className="mb-6"
        label="Example Select Input"
        options={options}
        option={selectedOption}
        setOption={setSelectedOption}
        href="/add-new-option"
        toolTipText="Add new option"
      />
      
      {/* Add more form elements or content as needed */}
    </div>
  );
}