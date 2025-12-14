import { getStaffById } from '@api/staff-actions';
import NewStaffForm from '../../components/new-staff-form';

type PageProps = {
  params: Promise<{ id: string }>;
};

// Recursive function to transform all null values to undefined
function transformNullToUndefined(obj: any): any {
  if (obj === null) return undefined;
  if (Array.isArray(obj)) return obj.map(transformNullToUndefined);
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, transformNullToUndefined(value)])
    );
  }
  return obj;
}

export default async function EditStaffPage({ params }: PageProps) {
    const resolvedParams = await params;
    const staffId = parseInt(resolvedParams.id);
    const result = await getStaffById(staffId);
    
    if (!result.success) {
        return <div>Error: {result.error}</div>;
    }

    const transformedStaff = transformNullToUndefined(result.data);

    return <NewStaffForm staff={transformedStaff} isEdit={true} />;
}