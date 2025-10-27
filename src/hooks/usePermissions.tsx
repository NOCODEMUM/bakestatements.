import { useAuth } from './useAuth';

export function usePermissions() {
  const { isTrialExpired, hasActiveSubscription } = useAuth();

  const isReadOnly = isTrialExpired && !hasActiveSubscription;

  const canCreate = !isReadOnly;
  const canEdit = !isReadOnly;
  const canDelete = !isReadOnly;
  const canExport = true;

  return {
    isReadOnly,
    canCreate,
    canEdit,
    canDelete,
    canExport,
  };
}
