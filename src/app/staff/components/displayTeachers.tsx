"use client";

import React from "react";
import Link from "next/link";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/FormElements/InputGroup/index";
import { useExport } from "@api/hooks/useExport";

export interface Staff {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  qualification: string;
  experience: number;
  subjects: string[];
  address?: string;
}

interface DisplayTeacherPageProps {
  staff?: Staff[];
  isLoading?: boolean;
  error?: string;
}

interface ExportButtonsProps {
  staff: Staff[];
  selectedStaff: number[];
}

const ExportButtons = ({ staff, selectedStaff }: ExportButtonsProps) => {
  const { exportToCSV } = useExport();

  const formatStaffForExport = (staff: Staff) => ({
    ID: staff.id,
    Name: staff.name,
    Surname: staff.surname,
    Email: staff.email,
    Phone: staff.phone,
    Role: staff.role,
    Qualification: staff.qualification,
    Experience: `${staff.experience} years`,
    Subjects: staff.subjects.join(', '),
    Address: staff.address || 'N/A'
  });

  const handleExportSelected = () => {
    const staffToExport = staff.filter(s => selectedStaff.includes(s.id));
    const formattedData = staffToExport.map(formatStaffForExport);
    exportToCSV(formattedData, 'selected-staff');
  };

  const handleExportAll = () => {
    const formattedData = staff.map(formatStaffForExport);
    exportToCSV(formattedData, 'all-staff');
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        onClick={handleExportAll}
        variant="outline"
        size="sm"
        disabled={staff.length === 0}
      >
        Export All Staff
      </Button>
      {selectedStaff.length > 0 && (
        <Button
          onClick={handleExportSelected}
          variant="outline"
          size="sm"
        >
          Export Selected ({selectedStaff.length})
        </Button>
      )}
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  staffName
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete <strong>{staffName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export function DisplayTeacherPage({
  staff = [],
  isLoading = false,
  error
}: DisplayTeacherPageProps) {
  const [selectedStaff, setSelectedStaff] = React.useState<number[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    staffId: number | null;
    staffName: string;
  }>({
    isOpen: false,
    staffId: null,
    staffName: ''
  });

  // Filter staff based on search and role filter
  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch =
      staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || staffMember.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const toggleStaffSelection = (staffId: number) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const selectAllStaff = () => {
    setSelectedStaff(
      selectedStaff.length === filteredStaff.length
        ? []
        : filteredStaff.map(staff => staff.id)
    );
  };

  // Mock delete function - replace with your actual delete function
  const deleteStaff = async (staffId: number) => {
    // TODO: Replace with your actual delete API call
    console.log('Deleting staff:', staffId);
    // await deleteStaffMember(staffId);

    // Remove from local state for immediate UI update
    setSelectedStaff(prev => prev.filter(id => id !== staffId));
    setDeleteModal({ isOpen: false, staffId: null, staffName: '' });
  };

  const openDeleteModal = (staffId: number, staffName: string) => {
    setDeleteModal({
      isOpen: true,
      staffId,
      staffName: `${staffName}`
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, staffId: null, staffName: '' });
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = Array.from(new Set(staff.map(member => member.role)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8 bg-red-50 rounded-lg border border-red-200 mx-4">
        <h3 className="font-semibold mb-2">Error Loading Staff</h3>
        <p>{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteModal.staffId && deleteStaff(deleteModal.staffId)}
        staffName={deleteModal.staffName}
      />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-10 mb-10">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Staff Management" className="space-y-5.5 !p-6.5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Staff List</h2>
              <div className="text-sm text-gray-500">
                {selectedStaff.length > 0
                  ? `${selectedStaff.length} selected of ${filteredStaff.length} displayed`
                  : `${filteredStaff.length} of ${staff.length} total staff members`
                }
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <InputGroup
                  label="Search by name"
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <ExportButtons
                staff={filteredStaff}
                selectedStaff={selectedStaff}
              />
              <Link
                href="/dashboard/users/staff/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Add New Staff
              </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <InputGroup
                        label=""
                        type="checkbox"
                        //checked={filteredStaff.length > 0 && selectedStaff.length === filteredStaff.length}
                        onChange={selectAllStaff}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={selectedStaff.length === filteredStaff.length ? "Deselect all staff" : "Select all staff"}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Staff ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Surname</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Qualification</TableHead>
                    <TableHead className="font-semibold">Experience</TableHead>
                    <TableHead className="font-semibold">Subjects</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staffMember) => (
                      <TableRow key={staffMember.id} className="hover:bg-gray-50">
                        <TableCell>
                          <InputGroup
                            type="checkbox"
                            //checked={selectedStaff.includes(staffMember.id)}
                            onChange={() => toggleStaffSelection(staffMember.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select ${staffMember.name} ${staffMember.surname}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{staffMember.id}</TableCell>
                        <TableCell className="font-medium">{staffMember.name}</TableCell>
                        <TableCell>{staffMember.surname}</TableCell>
                        <TableCell className="text-blue-600 hover:underline">
                          <a href={`mailto:${staffMember.email}`}>{staffMember.email}</a>
                        </TableCell>
                        <TableCell>
                          {staffMember.phone ? (
                            <a href={`tel:${staffMember.phone}`} className="text-gray-600 hover:text-gray-900">
                              {staffMember.phone}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${staffMember.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : staffMember.role === 'Principal'
                              ? 'bg-red-100 text-red-800'
                              : staffMember.role === 'Teacher'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {staffMember.role}
                          </span>
                        </TableCell>
                        <TableCell>{staffMember.qualification}</TableCell>
                        <TableCell>
                          <span className="text-gray-700">
                            {staffMember.experience} {staffMember.experience === 1 ? 'year' : 'years'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {staffMember.subjects.slice(0, 3).map((subject, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {subject}
                              </span>
                            ))}
                            {staffMember.subjects.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{staffMember.subjects.length - 3} more
                              </span>
                            )}
                            {staffMember.subjects.length === 0 && (
                              <span className="text-gray-400 text-xs">No subjects</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/dashboard/users/staff/${staffMember.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/dashboard/users/staff/${staffMember.id}`}
                              className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => openDeleteModal(staffMember.id, `${staffMember.name} ${staffMember.surname}`)}
                              className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <p className="text-lg font-medium mb-2">No staff members found</p>
                          <p className="text-gray-600 mb-4">
                            {searchTerm || roleFilter
                              ? "Try adjusting your search or filter criteria"
                              : "Get started by adding your first staff member"
                            }
                          </p>
                          <Link
                            href="/dashboard/users/staff/add"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Add your first staff member
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination would go here */}
            {/* <Pagination /> */}
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}