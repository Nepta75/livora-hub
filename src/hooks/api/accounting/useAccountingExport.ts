import { useMutation } from '@tanstack/react-query';
import { accountingService } from '@/services/admin/accountingService';
import { useAuth } from '@/hooks/useAuth';

export function useAccountingExport() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      const blob = await accountingService.exportPeriod(from, to, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comptabilite_${from}_${to}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
