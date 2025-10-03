import Link from 'next/link';
import Image from 'next/image';
import { Student } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { getInitials } from '@/lib/utils';
import { ROUTES } from '@/constants';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const initials = getInitials(student.firstName, student.lastName);

  return (
    <Link href={ROUTES.STUDENT_DETAIL(student.id)}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardBody>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {student.avatar ? (
                <Image
                  src={student.avatar}
                  alt={`${student.firstName} ${student.lastName}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-gray-500 truncate">{student.email}</p>
              <p className="text-xs text-gray-400 truncate">
                ID: {student.studentId}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
