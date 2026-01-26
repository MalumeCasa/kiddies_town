"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import { getStaffMemberById, updateStaff } from "@api/actions";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  role: string;
  profilePhoto: string;
  coverPhoto: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  employmentType: string;
  hireDate: string;
  qualification: string;
  specialization: string;
  experience: number;
  certifications: string[];
  subjects: string[];
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    department: "",
    role: "",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    employmentType: "",
    hireDate: "",
    qualification: "",
    specialization: "",
    experience: 0,
    certifications: [],
    subjects: [],
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        // You can change the ID to match the logged-in user
        // For now, using ID 11 as you mentioned earlier
        const result = await getStaffMemberById(11);
        
        if (result.data) {
          const staffData = result.data;
          setData({
            name: staffData.name || "",
            email: staffData.email || "",
            phone: "",
            address: "",
            position: staffData.position || "",
            department: staffData.department || "",
            role: staffData.role || "",
            profilePhoto: "/images/user/user-03.png",
            coverPhoto: "/images/cover/cover-01.png",
            dateOfBirth: "",
            gender: "",
            emergencyContact: "",
            emergencyPhone: "",
            employmentType: "",
            hireDate: "",
            qualification: "",
            specialization: "",
            experience: 0,
            certifications: [],
            subjects: [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "profilePhoto" || name === "coverPhoto") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setData(prev => ({
          ...prev,
          [name]: imageUrl,
        }));
      }
    } else {
      setData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field: 'certifications' | 'subjects', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage(null);

      // Create FormData for the update
      const formData = new FormData();
      formData.append('name', data.name.split(' ')[0] || '');
      formData.append('surname', data.name.split(' ').slice(1).join(' ') || '');
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('position', data.position);
      formData.append('department', data.department);
      formData.append('role', data.role);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('gender', data.gender);
      formData.append('emergencyContact', data.emergencyContact);
      formData.append('emergencyPhone', data.emergencyPhone);
      formData.append('employmentType', data.employmentType);
      formData.append('hireDate', data.hireDate);
      formData.append('qualification', data.qualification);
      formData.append('specialization', data.specialization);
      formData.append('experience', data.experience.toString());
      formData.append('certifications', data.certifications.join(', '));
      formData.append('subjects', data.subjects.join(', '));

      // Call the updateStaff action (using ID 11 for now)
      const result = await updateStaff(11, formData);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data.name) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Cover Photo */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            priority
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="coverPhoto"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />
              <CameraIcon />
              <span>Edit</span>
            </label>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {/* Profile Picture */}
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src={data.profilePhoto}
                width={160}
                height={160}
                className="overflow-hidden rounded-full"
                alt="profile"
                priority
              />
              <label
                htmlFor="profilePhoto"
                className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <CameraIcon />
                <input
                  type="file"
                  name="profilePhoto"
                  id="profilePhoto"
                  className="sr-only"
                  onChange={handleChange}
                  accept="image/png, image/jpg, image/jpeg"
                />
              </label>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={data.position}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={data.department}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-stroke px-6 py-3 text-center font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                  {data.name}
                </h3>
                <p className="font-medium">{data.position} • {data.department}</p>
                <p className="text-sm text-gray-6 dark:text-dark-6 mt-1">{data.email}</p>
                
                <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      259
                    </span>
                    <span className="text-body-sm">Posts</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      129K
                    </span>
                    <span className="text-body-sm">Followers</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      2K
                    </span>
                    <span className="text-body-sm-sm">Following</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mb-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Edit Profile
                </button>

                <div className="mx-auto max-w-[720px]">
                  <h4 className="font-medium text-dark dark:text-white">
                    About Me
                  </h4>
                  <p className="mt-4">
                    {data.position} at {data.department} department. 
                    {data.role && ` Role: ${data.role}.`}
                    {data.experience > 0 && ` Experience: ${data.experience} years.`}
                    {data.qualification && ` Qualification: ${data.qualification}.`}
                  </p>
                </div>

                <SocialAccounts />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}