import React from 'react';
import LocalStorageHelper from '../../helper/local_storage_helper';

const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const userRole = LocalStorageHelper.getRole();

  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return children;
  }

  return fallback;
};

export default RoleGuard;
