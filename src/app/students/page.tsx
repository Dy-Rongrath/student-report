'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StudentCard } from '@/components/features/StudentCard';
import { useFetch } from '@/hooks/useFetch';
import { ApiResponse, PaginatedResponse, Student } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error } = useFetch<ApiResponse<PaginatedResponse<Student>>>(
    API_ENDPOINTS.STUDENTS
  );

  const students = data?.data?.data || [];

  const filteredStudents = students.filter((student) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.studentId.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and view all student records
          </p>
        </div>

        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  type="search"
                  placeholder="Search students by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Add Student</Button>
            </div>
          </CardBody>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardBody>
              <p className="text-red-600">Error loading students: {error.message}</p>
            </CardBody>
          </Card>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? 'No students found matching your search.' : 'No students yet.'}
              </p>
            </CardBody>
          </Card>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
