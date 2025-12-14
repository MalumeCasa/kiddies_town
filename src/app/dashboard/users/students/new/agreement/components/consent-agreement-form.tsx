import React, { useState, useEffect } from "react";

import type { Metadata } from "next";

import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";


import { getRegisteredStudentByIdNumber } from '@api/student-actions';
import { relationshipOptions } from "@/components/FormElements/MultiSelect/RelationsMultiSelect";
import { Select } from "@/components/FormElements/select";

import { updateStudentConsent } from "@api/student-actions";


export const metadata: Metadata = {
    title: "Consent Agreement Form",
};

interface ConsentAgreementFormState {
    idNumber: string;
    surname: string;
    name: string;
    dateOfBirth?: string;

    popiConsent: boolean;
    motherPopiSignature: string;
    motherPopiDate: string;
    fatherPopiSignature: string;
    fatherPopiDate: string;

    motherSurname?: string;
    motherName?: string;
    fatherSurname?: string;
    fatherName?: string;

    signatory1FullName?: string;
    signatory1IDNumber?: string;
    signatory1Relation?: string;
    signatory1CellNumber?: string;
    signatory1Email?: string;
    signatory1PhysicalAddress?: string;
    signatory1Signature?: string;
    signatory1DateSigned?: string;
    signatory2FullName?: string;
    signatory2IDNumber?: string;
    signatory2Relation?: string;
    signatory2CellNumber?: string;
    signatory2Email?: string;
    signatory2PhysicalAddress?: string;
    signatory2Signature?: string;
    signatory2DateSigned?: string;
    signedAt?: string;
    agreementDate?: string;
    witnessName?: string;
    witnessSignature?: string;
    indemnityAgreement?: boolean;

}

export default function ConsentAgreementForm() {

    const [studentConsent, setStudentConsent] = useState<ConsentAgreementFormState>({
        idNumber: '',
        surname: '',
        name: '',
        dateOfBirth: '',

        motherSurname: '',
        motherName: '',
        fatherSurname: '',
        fatherName: '',

        popiConsent: false,
        motherPopiSignature: '',
        motherPopiDate: '',
        fatherPopiSignature: '',
        fatherPopiDate: '',

        signatory1CellNumber: '',
        signatory1DateSigned: '',
        signatory1Email: '',
        signatory1FullName: '',
        signatory1IDNumber: '',
        signatory1PhysicalAddress: '',
        signatory1Relation: '',
        signatory1Signature: '',
        signatory2CellNumber: '',
        signatory2DateSigned: '',
        signatory2Email: '',
        signatory2FullName: '',
        signatory2IDNumber: '',
        signatory2PhysicalAddress: '',
        signatory2Relation: '',
        signatory2Signature: '',

        signedAt: '',
        agreementDate: '',
        witnessName: '',
        witnessSignature: '',
        indemnityAgreement: false,


    })

    const [isLoading, setIsLoading] = useState(false);
    const [studentFound, setStudentFound] = useState<boolean | null>(null);
    const [searchAttempted, setSearchAttempted] = useState(false);

    // Function to handle ID number change and search
    const handleIdNumberChange = async (idNumber: string) => {
        setStudentConsent(prev => ({
            ...prev,
            idNumber,
        }));

        // Only search if ID number is not empty and has reasonable length
        if (idNumber.length >= 6) {
            setIsLoading(true);
            setSearchAttempted(true);
            try {
                const student = await getRegisteredStudentByIdNumber(idNumber);

                if (student) {
                    setStudentConsent(prev => ({
                        ...prev,
                        idNumber: student.idNumber || '',
                        surname: student.surname || '',
                        name: student.name || '',
                        dateOfBirth: student.dateOfBirth || '',

                        popiConsent: student.popiConsent || false,
                        motherSurname: student.motherSurname || '',
                        motherName: student.motherFirstNames || '',
                        fatherSurname: student.fatherSurname || '',
                        fatherName: student.fatherFirstNames || '',

                        motherPopiSignature: student.motherPopiSignature || '',
                        motherPopiDate: student.motherPopiDate || '',
                        fatherPopiSignature: student.fatherPopiSignature || '',
                        fatherPopiDate: student.fatherPopiDate || '',

                        signatory1FullName: student.signatory1FullName || '',
                        signatory1IDNumber: student.signatory1IDNumber || '',
                        signatory1Relation: student.signatory1Relation || '',
                        signatory1CellNumber: student.signatory1CellNumber || '',
                        signatory1Email: student.signatory1Email || '',
                        signatory1PhysicalAddress: student.signatory1PhysicalAddress || '',
                        signatory1Signature: student.signatory1Signature || '',
                        signatory1DateSigned: student.signatory1DateSigned || '',
                        signatory2FullName: student.signatory2FullName || '',
                        signatory2IDNumber: student.signatory2IDNumber || '',
                        signatory2Relation: student.signatory2Relation || '',
                        signatory2CellNumber: student.signatory2CellNumber || '',
                        signatory2Email: student.signatory2Email || '',
                        signatory2PhysicalAddress: student.signatory2PhysicalAddress || '',
                        signatory2Signature: student.signatory2Signature || '',
                        signatory2DateSigned: student.signatory2DateSigned || '',

                        signedAt: student.signedAt || '',
                        agreementDate: student.agreementDate || '',
                        witnessName: student.witnessName || '',
                        witnessSignature: student.witnessSignature || '',
                        indemnityAgreement: student.indemnityAgreement || false,
                    }));
                    setStudentFound(true);
                } else {
                    setStudentFound(false);
                }
            } catch (error) {
                console.error('Error fetching student:', error);
                setStudentFound(false);
            }
            setIsLoading(false);
        } else {
            setStudentFound(null);
            setSearchAttempted(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (studentConsent.idNumber) {
                handleIdNumberChange(studentConsent.idNumber);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [studentConsent.idNumber]);

    const handleStudentConsentFormChange = (field: keyof ConsentAgreementFormState, value: string | string[] | number | boolean) => {
        setStudentConsent(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Status display component
    const StatusIndicator = () => {
        if (isLoading) {
            return (
                <div className="flex items-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    <span className="text-sm text-blue-600 font-medium">Searching for student...</span>
                </div>
            );
        }
        if (!searchAttempted) {
            return (
                <div className="mt-2">
                    <span className="text-sm text-gray-500">
                        Enter 6 or more characters to search
                    </span>
                </div>
            );
        }

        if (studentFound === true) {
            return (
                <div className="flex items-center mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-700 font-medium">✓ Student found - details auto-filled</span>
                </div>
            );
        }

        if (studentFound === false) {
            return (
                <div className="flex items-center mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-yellow-700 font-medium">⚠ No student found with this ID number</span>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <form action={updateStudentConsent}>

                {/* POPI ACT AGREEMENT */}
                <ShowcaseSection
                    title="POPI ACT AGREEMENT"
                    className="space-y-5.5 !p-6.5 mb-4.5"
                >
                    <div className="space-y-4 text-sm text-gray-700">
                        <p>The School would like to request that you allow us to use your child&apos;s photos and video footage for educational and promotional purposes.</p>
                    </div>

                    <InputGroup
                        label="Student ID Number"
                        type="text"
                        name="idNumber"
                        placeholder="Enter Student ID Number"
                        className="w-full"
                        value={studentConsent.idNumber}
                        onChange={(e) => handleStudentConsentFormChange('idNumber', e.target.value)}
                        required
                    />
                    <StatusIndicator />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="popiConsent"
                            id="popiConsent"
                            className="h-10 w-4"
                            checked={studentConsent.popiConsent}
                            onChange={(e) => handleStudentConsentFormChange('popiConsent', e.target.checked)}
                        />
                        <label htmlFor="popiConsent" className="text-sm">
                            I grant permission to KIDDIES TOWN ECD to take photos and footage required by them for educational and promotional applications.
                        </label>
                    </div>

                    <div className="flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            label="Parent Signature (Mother)"
                            type="text"
                            name="motherPopiSignature"
                            placeholder="Mother's Signature"
                            className="w-full xl:w-1/2"
                            value={studentConsent.motherPopiSignature}
                            onChange={(e) => handleStudentConsentFormChange('motherPopiSignature', e.target.value)}
                        />
                        <InputGroup
                            label="Date"
                            type="date"
                            name="motherPopiDate"
                            className="w-full xl:w-1/2"
                            placeholder=""
                            value={studentConsent.motherPopiDate}
                            onChange={(e) => handleStudentConsentFormChange('motherPopiDate', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            label="Parent Signature (Father)"
                            type="text"
                            name="fatherPopiSignature"
                            placeholder="Father's Signature"
                            className="w-full xl:w-1/2"
                            value={studentConsent.fatherPopiSignature}
                            onChange={(e) => handleStudentConsentFormChange('fatherPopiSignature', e.target.value)}
                        />
                        <InputGroup
                            label="Date"
                            type="date"
                            name="fatherPopiDate"
                            className="w-full xl:w-1/2"
                            placeholder=""
                            value={studentConsent.fatherPopiDate}
                            onChange={(e) => handleStudentConsentFormChange('fatherPopiDate', e.target.value)}
                        />
                    </div>
                </ShowcaseSection>

                {/* INDEMNITY FORM */}
                <ShowcaseSection
                    title="INDEMNITY FORM"
                    className="space-y-5.5 !p-6.5 mb-4.5"
                >
                    <div className="space-y-4 text-sm text-gray-700">
                        <p className="font-medium">
                            I/We, the parent(s)/guardian(s) hereby grant permission that my/our child may participate in activities presented by our School (including excursions). May play on and participate in activities on the apparatus on and off the school grounds.
                        </p>

                        <p>
                            However, we must stress that KIDDIES TOWN ECD and its staff will take the usual good care of your child.
                        </p>

                        <p className="font-medium">
                            I/we do understand that all school activities (in-and including excursion) are at my/our child&apos;s own risk.
                        </p>

                        <p className="font-medium">
                            I/we also undertake to indemnify the School, the Principal and staff members, any person in the service of the centre, paid or unpaid, from any claim that might arise. Including loss of, replacement, injuries to your or your child&apos;s person and property, either direct or indirect during activities on the property or excursions arranged.
                        </p>

                        <p className="font-medium">
                            I/We hereby grant permission to the School to take any necessary steps in their own discretion to have our child admitted to hospital and/or treated by a doctor or other medical staff in the case an emergency might arise. I have read and understand the full agreement together with the Code of Conduct provided.
                        </p>
                    </div>

                    {/* Child Information */}
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-700">CHILD INFORMATION</h4>
                        <div className="flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="Child's Surname"
                                type="text"
                                name="surname"
                                placeholder="Surname of child"
                                className="w-full xl:w-1/2"
                                value={studentConsent.surname}
                                onChange={(e) => handleStudentConsentFormChange('surname', e.target.value)}
                                disabled
                            />

                            <InputGroup
                                label="Child's Name"
                                type="text"
                                name="name"
                                placeholder="Full name(s) of child"
                                className="w-full xl:w-1/2"
                                value={studentConsent.name}
                                onChange={(e) => handleStudentConsentFormChange('name', e.target.value)}
                                disabled
                            />
                            <InputGroup
                                label="Date of Birth"
                                type="date"
                                name="dateOfBirth"
                                className="w-full xl:w-1/2"
                                placeholder={new Date().toISOString().split('T')[0]}
                                value={studentConsent.dateOfBirth}
                                onChange={(e) => handleStudentConsentFormChange('dateOfBirth', e.target.value)}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Parent/Guardian Signatories */}
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-700">PARENT/GUARDIAN SIGNATORIES</h4>

                        {/* First Signatory */}
                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-700">Signatory 1</h5>
                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Full Name"
                                    type="text"
                                    name="signatory1FullName"
                                    placeholder="Full name of parent/guardian"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1FullName}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1FullName', e.target.value)}
                                />
                                <InputGroup
                                    label="ID Number"
                                    type="text"
                                    name="signatory1IDNumber"
                                    placeholder="ID number"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1IDNumber}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1IDNumber', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <Select
                                    label="Relation to Child"
                                    name="signatory1Relation"
                                    placeholder="e.g., Mother, Father, Guardian"
                                    className="w-full xl:w-1/2"
                                    items={relationshipOptions}
                                    value={studentConsent.signatory1Relation}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1Relation', e)}
                                />
                                <InputGroup
                                    label="Cell Number"
                                    type="text"
                                    name="signatory1CellNumber"
                                    placeholder="Contact number"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1CellNumber}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1CellNumber', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Email Address"
                                    type="email"
                                    name="signatory1Email"
                                    placeholder="Email address"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1Email}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1Email', e.target.value)}
                                />
                                <InputGroup
                                    label="Physical Address"
                                    type="text"
                                    name="signatory1PhysicalAddress"
                                    placeholder="Home address"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1PhysicalAddress}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1PhysicalAddress', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Signature"
                                    type="text"
                                    name="signatory1Signature"
                                    placeholder="Digital signature"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory1Signature}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1Signature', e.target.value)}
                                />
                                <InputGroup
                                    label="Date Signed"
                                    type="date"
                                    name="signatory1DateSigned"
                                    className="w-full xl:w-1/2"
                                    placeholder=''
                                    value={studentConsent.signatory1DateSigned}
                                    onChange={(e) => handleStudentConsentFormChange('signatory1DateSigned', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Second Signatory */}
                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-700">Signatory 2 (Optional)</h5>
                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Full Name"
                                    type="text"
                                    name="signatory2FullName"
                                    placeholder="Full name of second parent/guardian"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2FullName}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2FullName', e.target.value)}
                                />
                                <InputGroup
                                    label="ID Number"
                                    type="text"
                                    name="signatory2IDNumber"
                                    placeholder="ID number"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2IDNumber}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2IDNumber', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <Select
                                    label="Relation to Child"
                                    name="signatory2Relation"
                                    placeholder="e.g., Mother, Father, Guardian"
                                    className="w-full xl:w-1/2"
                                    items={relationshipOptions}
                                    value={studentConsent.signatory2Relation}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2Relation', e)}
                                />
                                <InputGroup
                                    label="Cell Number"
                                    type="text"
                                    name="signatory2CellNumber"
                                    placeholder="Contact number"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2CellNumber}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2CellNumber', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Email Address"
                                    type="email"
                                    name="signatory2Email"
                                    placeholder="Email address"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2Email}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2Email', e.target.value)}
                                />
                                <InputGroup
                                    label="Physical Address"
                                    type="text"
                                    name="signatory2PhysicalAddress"
                                    placeholder="Home address"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2PhysicalAddress}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2PhysicalAddress', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Signature"
                                    type="text"
                                    name="signatory2Signature"
                                    placeholder="Digital signature"
                                    className="w-full xl:w-1/2"
                                    value={studentConsent.signatory2Signature}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2Signature', e.target.value)}
                                />
                                {/* In both signatory sections, update the date fields like this: */}
                                <InputGroup
                                    label="Date Signed"
                                    type="date"
                                    name="signatory2DateSigned"
                                    className="w-full xl:w-1/2"
                                    placeholder=""
                                    value={studentConsent.signatory2DateSigned}
                                    onChange={(e) => handleStudentConsentFormChange('signatory2DateSigned', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Additional Signatories Notice */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> If more than two people need to sign this indemnity form, please contact the school office for additional signature pages.
                            </p>
                        </div>
                    </div>

                    {/* Declaration and Agreement Section */}
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-700">DECLARATION AND AGREEMENT</h4>

                        <div className="space-y-3 text-sm text-gray-700">
                            <p>
                                I/We, the undersigned, declare that the information supplied in this document is correct. I/We furthermore bind myself/ourselves irrevocably to all of the terms and conditions set out in this agreement.
                            </p>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="indemnityAgreement"
                                    name="indemnityAgreement"
                                    className="h-4 w-4"
                                    checked={studentConsent.indemnityAgreement}
                                    onChange={(e) => handleStudentConsentFormChange('indemnityAgreement', e.target.checked)}
                                />
                                <label htmlFor="indemnityAgreement" className="text-sm font-medium">
                                    I/We have read, understood, and agree to all terms and conditions of this Indemnity Form
                                </label>
                            </div>
                        </div>

                        {/* Signing Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-3">
                                <h5 className="font-medium text-gray-700">Signing Location & Date</h5>
                                <InputGroup
                                    label="Signed at"
                                    type="text"
                                    name="signedAt"
                                    placeholder="City/Town where signed"
                                    className="w-full"
                                    value={studentConsent.signedAt}
                                    onChange={(e) => handleStudentConsentFormChange('signedAt', e.target.value)}
                                />
                                <InputGroup
                                    label="Date of Agreement"
                                    type="date"
                                    className="w-full"
                                    name="agreementDate"
                                    placeholder=""
                                    value={studentConsent.agreementDate}
                                    onChange={(e) => handleStudentConsentFormChange('agreementDate', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <h5 className="font-medium text-gray-700">Witness (Optional)</h5>
                                <InputGroup
                                    label="Witness Name"
                                    type="text"
                                    name="witnessName"
                                    placeholder="Full name of witness"
                                    className="w-full"
                                    value={studentConsent.witnessName}
                                    onChange={(e) => handleStudentConsentFormChange('witnessName', e.target.value)}
                                />
                                <InputGroup
                                    label="Witness Signature"
                                    type="text"
                                    name="witnessSignature"
                                    placeholder="Witness signature"
                                    className="w-full"
                                    value={studentConsent.witnessSignature}
                                    onChange={(e) => handleStudentConsentFormChange('witnessSignature', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <h5 className="font-semibold text-yellow-800 mb-2">Important Information</h5>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• This indemnity form covers all school activities, including excursions and use of school apparatus</li>
                            <li>• The school will take reasonable care of your child during all activities</li>
                            <li>• Medical emergency authorization is included in this agreement</li>
                            <li>• Both parents/guardians are encouraged to sign where applicable</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                            Submit Consent Agreement
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            By clicking submit, you agree to all terms and conditions outlined above
                        </p>
                    </div>
                </ShowcaseSection>
            </form>
        </>
    )
}