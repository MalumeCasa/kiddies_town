import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { updateStudentWithDetails } from "@api/student-actions";

export function FastUploadEditForm(student: any, formdata: FormData) {
    // The `student` data is passed directly into the form's server action `updateStudentWithDetails`.
    // The `formdata` parameter is unused here and can be removed.
    // The `student` data is still needed to set the default values.
    
    return (
        <ShowcaseSection title="Edit Student" className="space-y-5.5 !p-6.5">
            {/* The `formdata` parameter in `updateStudentWithDetails` is no longer needed in the component definition. */}
            <form className="space-y-6" action={updateStudentWithDetails.bind(null, student.id)}>
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="SURNAME"
                        name="surname"
                        type="text"
                        placeholder={student.surname+""}
                        defaultValue={student.surname+""} // Use defaultValue for editable inputs
                        className="w-full xl:w-1/2"
                    />

                    <InputGroup
                        label="FIRST NAME/S"
                        name="name"
                        type="text"
                        placeholder={student.name}
                        defaultValue={student.name} // Use defaultValue
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="Email"
                        name="email"
                        type="email"
                        placeholder={student.email}
                        defaultValue={student.email} // Use defaultValue
                        className="w-full xl:w-1/2"
                        required
                    />

                    <InputGroup
                        label="PHONE NUMBER"
                        name="phone"
                        type="text"
                        placeholder={student.phone}
                        defaultValue={student.phone} // Use defaultValue
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <InputGroup
                        label="ADDRESS"
                        name="address"
                        type="text"
                        placeholder={student.address}
                        defaultValue={student.address} // Use defaultValue
                        className="w-full xl:w-3/4"
                    />

                    <InputGroup
                        label="ATTENDANCE"
                        name="attendance"
                        type="text"
                        placeholder={student.attendance}
                        defaultValue={student.attendance} // Use defaultValue
                        className="mb-4.5"
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

