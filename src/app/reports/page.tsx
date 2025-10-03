'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFetch } from '@/hooks/useFetch';
import { ApiResponse, PaginatedResponse, Report } from '@/types';
import { API_ENDPOINTS } from '@/constants';
import { formatDateShort } from '@/lib/utils';

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error } = useFetch<ApiResponse<PaginatedResponse<Report>>>(
    API_ENDPOINTS.REPORTS
  );

  const reports = data?.data?.data || [];

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      report.subject.toLowerCase().includes(searchLower) ||
      report.teacher.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all student reports
          </p>
        </div>

        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  type="search"
                  placeholder="Search reports by subject or teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Create Report</Button>
            </div>
          </CardBody>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardBody>
              <p className="text-red-600">Error loading reports: {error.message}</p>
            </CardBody>
          </Card>
        )}

        {!loading && !error && filteredReports.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? 'No reports found matching your search.' : 'No reports yet.'}
              </p>
            </CardBody>
          </Card>
        )}

        {!loading && !error && filteredReports.length > 0 && (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.subject}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            report.grade === 'A' || report.grade === 'A+'
                              ? 'bg-green-100 text-green-800'
                              : report.grade === 'B' || report.grade === 'B+'
                              ? 'bg-blue-100 text-blue-800'
                              : report.grade === 'C' || report.grade === 'C+'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          Grade: {report.grade}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Teacher:</span> {report.teacher}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Semester:</span> {report.semester}{' '}
                          {report.academicYear}
                        </p>
                        {report.comments && (
                          <p className="text-sm text-gray-600 mt-2">{report.comments}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500">
                        Created: {formatDateShort(report.createdAt)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
