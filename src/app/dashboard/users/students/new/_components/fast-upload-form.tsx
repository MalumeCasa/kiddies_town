import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { createStudentWithDetails } from "@api/student-actions";

export function FastUploadForm() {
    return (
        <ShowcaseSection title="Fast Upload Students" className="space-y-5.5 !p-6.5">
            <form className="space-y-6" action={createStudentWithDetails}>
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="SURNAME"
                        name="surname"
                        type="text"
                        placeholder="Enter last name"
                        className="w-full xl:w-1/2"
                    />

                    <InputGroup
                        label="FIRST NAME/S"
                        name="name"
                        type="text"
                        placeholder="Enter first name(s)"
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">

                    <InputGroup
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full xl:w-1/2"
                        required
                    />

                    <InputGroup
                        label="PHONE NUMBER"
                        name="phone"
                        type="text"
                        placeholder="Enter contacts"
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="ADDRESS"
                        name="address"
                        type="text"
                        placeholder="Enter address"
                        className="w-full xl:full"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="ATTENDANCE"
                        name="attendance"
                        type="text"
                        placeholder="Enter attendance details"
                        className="w-full xl:w-1/2"
                    />

                    <InputGroup
                        label="Class"
                        name="studentClass"
                        type="text"
                        placeholder="Enter class details"
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
                    >
                        Upload Students
                    </button>
                </div>
            </form>

        </ShowcaseSection>
    );
}