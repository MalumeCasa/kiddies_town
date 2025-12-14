import { getStaffById } from '@api/staff-actions';
import ViewStaffForm from '../components/view-staff-form';

export default async function ViewStaffPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    // Await the params Promise
    const { id } = await params;
    const result = await getStaffById(id);
    
    if (!result.success) {
        return <div>Error: {result.error}</div>;
    }

    return <ViewStaffForm staff={result.data} />; 
}