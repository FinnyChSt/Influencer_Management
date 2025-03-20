export const MAX_NAME_LENGTH = 50;
// Additional handling of Name validation Names does not include numbers or special character
export function isValidName(name: string): true | string {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return "Name cannot be empty";
  }

  if (trimmedName.length > MAX_NAME_LENGTH) {
    return `Name cannot be longer than ${MAX_NAME_LENGTH} characters`;
  }

  if (!/^[\p{L}\p{M}'\s-]+$/u.test(trimmedName)) {
    return "Name can only contain letters, spaces, hyphens and apostrophes";
  }

  return true;
}
