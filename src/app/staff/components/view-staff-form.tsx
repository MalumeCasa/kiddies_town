import React from "react";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import type { Staff } from "@api/db/staff-type";
import { getStatusBadge } from './common';

interface ViewStaffFormProps {
    staff: Staff;
}

export default function ViewStaffForm({ staff }: ViewStaffFormProps) {
    // Format role for display
    const formatRole = (role: string) => {
        return role.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format employment type for display
    const formatEmploymentType = (type: string) => {
        return type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Get department badge color
    const getDepartmentBadge = (department: string) => {
        switch (department) {
            case 'academic':
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case 'administrative':
                return "bg-purple-100 text-purple-800 border border-purple-200";
            case 'support':
                return "bg-orange-100 text-orange-800 border border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    return (
        <>
            <Breadcrumb pageName="Staff Profile" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title={`Staff Profile - ${staff.name} ${staff.surname}`} className="space-y-5.5 !p-6.5">
                        {/* Header with Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{staff.name} {staff.surname}</h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentBadge(staff.department)}`}>
                                        {staff.department.charAt(0).toUpperCase() + staff.department.slice(1)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(staff.isActive, staff.employmentStatus)}`}>
                                        {staff.isActive ? (staff.employmentStatus === 'suspended' ? 'Suspended' : 'Active') : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/staff/${staff.id}/edit`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </Link>
                                <Link
                                    href="/staff"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Back to Directory
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Personal Information */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField label="Staff ID" value={staff.staffId} />
                                        <InfoField label="Email" value={staff.email} />
                                        <InfoField label="Phone" value={staff.phone} />
                                        <InfoField label="Date of Birth" value={staff.dateOfBirth} />
                                        <InfoField label="Gender" value={staff.gender} />
                                        <InfoField label="Address" value={staff.address} />
                                        <InfoField label="Emergency Contact" value={staff.emergencyContact} />
                                        <InfoField label="Emergency Phone" value={staff.emergencyPhone} />
                                    </div>
                                </div>

                                {/* Employment Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Employment Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField label="Position" value={staff.position} />
                                        <InfoField label="Role" value={formatRole(staff.role)} />
                                        <InfoField label="Department" value={staff.department.charAt(0).toUpperCase() + staff.department.slice(1)} />
                                        <InfoField label="Employment Type" value={formatEmploymentType(staff.employmentType)} />
                                        <InfoField label="Hire Date" value={staff.hireDate} />
                                        <InfoField label="Experience" value={`${staff.experience} years`} />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information & Quick Stats */}
                            <div className="space-y-6">
                                {/* Professional Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Professional Information</h3>
                                    <div className="space-y-4">
                                        <InfoField label="Qualification" value={staff.qualification} />
                                        <InfoField label="Specialization" value={staff.specialization} />
                                        
                                        {staff.certifications && staff.certifications.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {staff.certifications.map((cert, index) => (
                                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {staff.subjects && staff.subjects.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {staff.subjects.map((subject, index) => (
                                                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm border border-green-200">
                                                            {subject}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Staff ID:</span>
                                            <span className="text-sm font-medium">{staff.staffId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Employment:</span>
                                            <span className="text-sm font-medium">{formatEmploymentType(staff.employmentType)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusBadge(staff.isActive, staff.employmentStatus)}`}>
                                                {staff.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Experience:</span>
                                            <span className="text-sm font-medium">{staff.experience} years</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{staff.experience}</div>
                                    <div className="text-sm text-gray-600">Years of Experience</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {staff.subjects?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Subjects</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {staff.certifications?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Certifications</div>
                                </div>
                            </div>
                        </div>
                    </ShowcaseSection>
                </div>
            </div>
        </>
    );
}

// Helper component for displaying information fields
function InfoField({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <div className="text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[42px] flex items-center">
                {value || <span className="text-gray-400">Not provided</span>}
            </div>
        </div>
    );
}