import { Outlet } from 'react-router-dom';
import type { Role } from '../types';

interface ProtectedRouteProps {
  roles?: Role[];
}

export function ProtectedRoute({ roles: _roles }: ProtectedRouteProps) {
  // Auth restrictions relaxed for development — all pages accessible
  void _roles;
  return <Outlet />;
}
