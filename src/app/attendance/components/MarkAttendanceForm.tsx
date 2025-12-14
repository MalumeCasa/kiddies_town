'use client';

import { useState, useEffect } from 'react';
import { markAttendance, markClassAttendance, getTodaysClassAttendance } from '@api/actions';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';

interface Student {
  id: number;
  name: string;
  surname: string;
  class: string;
}

export function MarkAttendanceForm() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock data - replace with actual API call
  const classes = [
    { id: '1', name: 'Grade 1A' },
    { id: '2', name: 'Grade 2B' },
    { id: '3', name: 'Grade 3C' },
    { id: '4', name: 'Grade 4A' },
  ];

  const mockStudents: Record<string, Student[]> = {
    '1': [
      { id: 1, name: 'John', surname: 'Doe', class: '1' },
      { id: 2, name: 'Jane', surname: 'Smith', class: '1' },
      { id: 3, name: 'Mike', surname: 'Johnson', class: '1' },
    ],
    '2': [
      { id: 4, name: 'Sarah', surname: 'Wilson', class: '2' },
      { id: 5, name: 'Tom', surname: 'Brown', class: '2' },
      { id: 6, name: 'Emma', surname: 'Davis', class: '2' },
    ],
    '3': [
      { id: 7, name: 'James', surname: 'Miller', class: '3' },
      { id: 8, name: 'Lisa', surname: 'Taylor', class: '3' },
      { id: 9, name: 'Robert', surname: 'Anderson', class: '3' },
    ],
    '4': [
      { id: 10, name: 'Maria', surname: 'Thomas', class: '4' },
      { id: 11, name: 'David', surname: 'Jackson', class: '4' },
      { id: 12, name: 'Linda', surname: 'White', class: '4' },
    ],
  };

  const fetchClassStudents = async (classId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents(mockStudents[classId] || []);
      
      // Load today's attendance if available
      const todayAttendance = await getTodaysClassAttendance(parseInt(classId));
      if (todayAttendance.success && todayAttendance.data) {
        const todayAttendanceMap: Record<number, string> = {};
        todayAttendance.data.forEach((record: any) => {
          todayAttendanceMap[record.studentId] = record.status;
        });
        setAttendance(todayAttendanceMap);
      } else {
        setAttendance({});
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (classId) {
      fetchClassStudents(classId);
    } else {
      setStudents([]);
      setAttendance({});
    }
  };

  const markStudentAttendance = async (studentId: number, status: string) => {
    try {
      const formData = new FormData();
      formData.append('studentId', studentId.toString());
      formData.append('classId', selectedClass);
      formData.append('date', selectedDate);
      formData.append('status', status);

      const result = await markAttendance(formData);
      
      if (result.success) {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
        setMessage({ type: 'success', text: `Attendance marked as ${status}` });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to mark attendance' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark attendance' });
    }
  };

  const markAllAsPresent = async () => {
    if (!selectedClass) return;

    try {
      const formData = new FormData();
      formData.append('classId', selectedClass);
      formData.append('date', selectedDate);
      formData.append('status', 'present');

      const result = await markClassAttendance(formData);
      
      if (result.success) {
        const newAttendance: Record<number, string> = {};
        students.forEach(student => {
          newAttendance[student.id] = 'present';
        });
        setAttendance(newAttendance);
        setMessage({ type: 'success', text: 'All students marked as present' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to mark attendance' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark attendance' });
    }
  };

  const clearAllAttendance = () => {
    setAttendance({});
    setMessage({ type: 'success', text: 'Attendance cleared' });
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const late = Object.values(attendance).filter(status => status === 'late').length;
    const total = students.length;

    return { present, absent, late, total };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className={`flex-shrink-0 ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <select 
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Choose a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            onClick={markAllAsPresent}
            disabled={!selectedClass || isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Mark All Present
          </button>
          <button
            onClick={clearAllAttendance}
            disabled={!selectedClass || isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats */}
      {selectedClass && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{stats.present}</div>
            <div className="text-sm text-green-600">Present</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{stats.absent}</div>
            <div className="text-sm text-red-600">Absent</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{stats.late}</div>
            <div className="text-sm text-yellow-600">Late</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Students</div>
          </div>
        </div>
      )}

      {/* Students List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      ) : selectedClass && students.length > 0 ? (
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {student.name[0]}{student.surname[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {student.name} {student.surname}
                  </h3>
                  <p className="text-sm text-gray-500">Student ID: {student.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {['present', 'absent', 'late', 'half-day'].map((status) => (
                  <button
                    key={status}
                    onClick={() => markStudentAttendance(student.id, status)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      attendance[student.id] === status
                        ? status === 'present'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : status === 'absent'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : status === 'late'
                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                          : 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : selectedClass ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600">There are no students in this class.</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🏫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
          <p className="text-gray-600">Choose a class to start marking attendance.</p>
        </div>
      )}

      {/* Submit Button */}
      {selectedClass && students.length > 0 && Object.keys(attendance).length > 0 && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => setMessage({ type: 'success', text: 'Attendance saved successfully!' })}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
}