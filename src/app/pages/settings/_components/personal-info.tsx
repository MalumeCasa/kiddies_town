"use client";

import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { getStaffMemberById, updateStaff } from "@api/actions";
// Import Lucide icons
import {
  User,
  Phone,
  Mail,
  MapPin,
  Cake,
  Briefcase,
  Calendar,
  GraduationCap,
  BookOpen,
  Edit2,
} from "lucide-react";

interface PersonalInfoData {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  employmentType: string;
  position: string;
  department: string;
  hireDate: string;
  qualification: string;
  specialization: string;
  experience: number;
  certifications: string;
  subjects: string;
  bio: string;
}

export function PersonalInfoForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<PersonalInfoData>({
    id: 0,
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    employmentType: "",
    position: "",
    department: "",
    hireDate: "",
    qualification: "",
    specialization: "",
    experience: 0,
    certifications: "",
    subjects: "",
    bio: "",
  });

  // Fetch staff data
  useEffect(() => {
    async function fetchStaffData() {
      try {
        setIsLoading(true);
        const result = await getStaffMemberById(11);
        
        if (result.data) {
          const fullName = result.data.name.split(" ");
          const name = fullName[0] || "";
          const surname = fullName.slice(1).join(" ") || "";
          
          setFormData(prev => ({
            ...prev,
            id: 11,
            name,
            surname,
            email: result.data.email || "",
            phone: "",
            address: "",
            dateOfBirth: "",
            gender: "",
            emergencyContact: "",
            emergencyPhone: "",
            employmentType: "",
            position: result.data.position || "",
            department: result.data.department || "",
            hireDate: "",
            qualification: "",
            specialization: "",
            experience: 0,
            certifications: "",
            subjects: "",
            bio: `${result.data.position} in ${result.data.department} department. ${result.data.role ? `Role: ${result.data.role}` : ""}`,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch staff data:", error);
        setMessage({ type: 'error', text: 'Failed to load personal information' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaffData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setMessage(null);

      const updateFormData = new FormData();
      updateFormData.append('name', formData.name);
      updateFormData.append('surname', formData.surname);
      updateFormData.append('email', formData.email);
      updateFormData.append('phone', formData.phone);
      updateFormData.append('address', formData.address);
      updateFormData.append('dateOfBirth', formData.dateOfBirth);
      updateFormData.append('gender', formData.gender);
      updateFormData.append('emergencyContact', formData.emergencyContact);
      updateFormData.append('emergencyPhone', formData.emergencyPhone);
      updateFormData.append('employmentType', formData.employmentType);
      updateFormData.append('position', formData.position);
      updateFormData.append('department', formData.department);
      updateFormData.append('hireDate', formData.hireDate);
      updateFormData.append('qualification', formData.qualification);
      updateFormData.append('specialization', formData.specialization);
      updateFormData.append('experience', formData.experience.toString());
      updateFormData.append('certifications', formData.certifications);
      updateFormData.append('subjects', formData.subjects);

      const result = await updateStaff(formData.id, updateFormData);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Personal information updated successfully!' });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update personal information:", error);
      setMessage({ type: 'error', text: 'Failed to update personal information' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // You might want to re-fetch the data here to reset any changes
  };

  if (isLoading) {
    return (
      <ShowcaseSection title="Personal Information" className="!p-7">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      {message && (
        <div className={`mb-5 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="name"
            label="First Name"
            placeholder="John"
            value={formData.name}
            onChange={handleInputChange}
            icon={<User className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="surname"
            label="Last Name"
            placeholder="Doe"
            value={formData.surname}
            onChange={handleInputChange}
            icon={<User className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="email"
            name="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleInputChange}
            icon={<Mail className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="tel"
            name="phone"
            label="Phone Number"
            placeholder="+27 12 345 6789"
            value={formData.phone}
            onChange={handleInputChange}
            icon={<Phone className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        {/* Address */}
        <InputGroup
          className="mb-5.5"
          type="text"
          name="address"
          label="Address"
          placeholder="123 Main Street, City, Country"
          value={formData.address}
          onChange={handleInputChange}
          icon={<MapPin className="size-5" />}
          iconPosition="left"
          height="sm"
          disabled={!isEditing}
        />

        {/* Personal Details */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="date"
            name="dateOfBirth"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            icon={<Cake className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
              Gender
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="size-5 text-gray-4 dark:text-dark-6" />
              </div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-12 text-dark outline-none transition focus:border-primary disabled:bg-gray-1 disabled:text-gray-4 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-4"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="emergencyContact"
            label="Emergency Contact Name"
            placeholder="Emergency contact name"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            icon={<User className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="tel"
            name="emergencyPhone"
            label="Emergency Contact Phone"
            placeholder="+27 12 345 6789"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            icon={<Phone className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        {/* Employment Information */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="position"
            label="Position"
            placeholder="Teacher"
            value={formData.position}
            onChange={handleInputChange}
            icon={<Briefcase className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="department"
            label="Department"
            placeholder="Mathematics"
            value={formData.department}
            onChange={handleInputChange}
            icon={<Briefcase className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="date"
            name="hireDate"
            label="Hire Date"
            value={formData.hireDate}
            onChange={handleInputChange}
            icon={<Calendar className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
              Employment Type
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Briefcase className="size-5 text-gray-4 dark:text-dark-6" />
              </div>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-12 text-dark outline-none transition focus:border-primary disabled:bg-gray-1 disabled:text-gray-4 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-4"
              >
                <option value="">Select Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="qualification"
            label="Highest Qualification"
            placeholder="Bachelor's Degree in Education"
            value={formData.qualification}
            onChange={handleInputChange}
            icon={<GraduationCap className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="specialization"
            label="Specialization"
            placeholder="Mathematics Education"
            value={formData.specialization}
            onChange={handleInputChange}
            icon={<GraduationCap className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="number"
            name="experience"
            label="Years of Experience"
            placeholder="5"
            value={formData.experience.toString()}
            onChange={handleInputChange}
            icon={<Calendar className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="certifications"
            label="Certifications (comma separated)"
            placeholder="Teaching License, First Aid, etc."
            value={formData.certifications}
            onChange={handleInputChange}
            icon={<GraduationCap className="size-5" />}
            iconPosition="left"
            height="sm"
            disabled={!isEditing}
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="text"
          name="subjects"
          label="Subjects (comma separated)"
          placeholder="Mathematics, Physics, Calculus"
          value={formData.subjects}
          onChange={handleInputChange}
          icon={<BookOpen className="size-5" />}
          iconPosition="left"
          height="sm"
          disabled={!isEditing}
        />

        {/* Bio */}
        <TextAreaGroup
          className="mb-5.5"
          label="BIO"
          name="bio"
          placeholder="Write your bio here"
          icon={<Edit2 className="size-5" />}
          value={formData.bio}
          onChange={handleInputChange}
          disabled={!isEditing}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90"
            >
              Edit Information
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </form>
    </ShowcaseSection>
  );
}