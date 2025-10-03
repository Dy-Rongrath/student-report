import { NextRequest, NextResponse } from 'next/server';
import { Report, ApiResponse, PaginatedResponse } from '@/types';

// Mock data - replace with actual database calls
const mockReports: Report[] = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathematics',
    grade: 'A',
    semester: 'Fall',
    academicYear: '2024',
    teacher: 'Dr. Smith',
    comments: 'Excellent performance',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Physics',
    grade: 'B+',
    semester: 'Fall',
    academicYear: '2024',
    teacher: 'Prof. Johnson',
    comments: 'Good understanding of concepts',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const studentId = searchParams.get('studentId');

    // Filter by studentId if provided
    let filteredReports = mockReports;
    if (studentId) {
      filteredReports = mockReports.filter((r) => r.studentId === studentId);
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredReports.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<Report>> = {
      success: true,
      data: {
        data: paginatedData,
        total: filteredReports.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredReports.length / pageSize),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch reports',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.subject || !body.grade) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Create new report (mock)
    const newReport: Report = {
      id: String(mockReports.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReports.push(newReport);

    const response: ApiResponse<Report> = {
      success: true,
      data: newReport,
      message: 'Report created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to create report',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
