import { NextRequest, NextResponse } from 'next/server';
import { Student, ApiResponse, PaginatedResponse } from '@/types';

// Mock data - replace with actual database calls
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    studentId: 'STU001',
    enrollmentDate: '2024-01-15',
    class: '10A',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    studentId: 'STU002',
    enrollmentDate: '2024-01-15',
    class: '10A',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockStudents.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<Student>> = {
      success: true,
      data: {
        data: paginatedData,
        total: mockStudents.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockStudents.length / pageSize),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch students',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.studentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Create new student (mock)
    const newStudent: Student = {
      id: String(mockStudents.length + 1),
      ...body,
      enrollmentDate: body.enrollmentDate || new Date().toISOString(),
    };

    mockStudents.push(newStudent);

    const response: ApiResponse<Student> = {
      success: true,
      data: newStudent,
      message: 'Student created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to create student',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
