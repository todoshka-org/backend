import { Role } from 'src/auth/enums/role.enum';
import { UserDocument } from 'src/users/user.schema';
import { Rights } from '../enums/rights.enum';
import { UserRights } from '../schemas/user-rights.schema';

export function checkRights(
  document: UserRights[],
  currentUser: UserDocument,
  rights: Rights[] = null,
): boolean {
  if (currentUser.roles.includes(Role.ADMIN)) {
    return true;
  }

  const userRights = document.find((right) => right.user.id === currentUser.id);

  if (!userRights) {
    return false;
  }
  if (rights === null) {
    return true;
  }

  return rights.some((right) => userRights.rights.includes(right));
}
