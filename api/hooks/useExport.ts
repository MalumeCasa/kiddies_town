export const useExport = () => {
    const exportToCSV = <T extends Record<string, any>>(data: T[], filename: string) => {
      if (data.length === 0) {
        alert('No data to export');
        return;
      }
  
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };
  
    return { exportToCSV };
  };