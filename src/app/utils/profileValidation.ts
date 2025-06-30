import { User } from "next-auth"

/**
 * Valida se o perfil que está sendo acessado pertence ao usuário logado
 * @param sessionUser - Usuário da sessão
 * @param profileUser - Usuário do perfil sendo visualizado
 * @param profileId - ID/name do perfil da URL
 * @returns boolean indicando se é o dono do perfil
 */
export function validateProfileOwnership(
  sessionUser: { name?: string | null; email?: string | null; image?: string | null } | undefined,
  profileUser: User,
  profileId: string
): boolean {
  if (!sessionUser || !profileUser) {
    return false
  }

  // Comparações possíveis para verificar se é o mesmo usuário:
  
  // 1. Comparar pelo name da sessão com o ID da URL
  if (sessionUser.name === profileId) {
    return true
  }

  // 2. Comparar pelo name da sessão com o name do perfil
  if (sessionUser.name === profileUser.name) {
    return true
  }

  // 3. Comparar pelo email (se disponível)
  if (sessionUser.email && sessionUser.email === profileUser.email) {
    return true
  }

  // 4. Comparar pelo nickname/username
  if (sessionUser.name === profileUser.nickname) {
    return true
  }

  return false
}

/**
 * Retorna o nível de permissão do usuário para o perfil
 */
export type ProfilePermissionLevel = 'owner' | 'viewer'

export function getProfilePermissionLevel(
  sessionUser: { name?: string | null; email?: string | null; image?: string | null } | undefined,
  profileUser: User,
  profileId: string
): ProfilePermissionLevel {
  return validateProfileOwnership(sessionUser, profileUser, profileId) ? 'owner' : 'viewer'
}

/**
 * Validation functions for registration form
 */
export const registerValidation = {
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long'
    },
    maxLength: {
      value: 50,
      message: 'Name must be less than 50 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_\s]+$/,
      message: 'Name can only contain letters, numbers, underscores, and spaces'
    }
  },
  
  nickname: {
    required: 'Nickname is required',
    minLength: {
      value: 3,
      message: 'Nickname must be at least 3 characters long'
    },
    maxLength: {
      value: 30,
      message: 'Nickname must be less than 30 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Nickname can only contain letters, numbers, and underscores'
    }
  },
  
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    }
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#+\-_=(){}\[\]|\\:";'<>,.\/~`^]{8,}$/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  
  telephone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    }
  },
  
  website: {
    pattern: {
      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: 'Please enter a valid website URL'
    }
  },
  
  instagram: {
    pattern: {
      value: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
      message: 'Please enter a valid Instagram URL'
    }
  },
  
  youtube: {
    pattern: {
      value: /^(https?:\/\/)?(www\.)?youtube\.com\/(channel\/|c\/|user\/|@)?[a-zA-Z0-9_-]+\/?$/,
      message: 'Please enter a valid YouTube URL'
    }
  },
  
  x: {
    pattern: {
      value: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
      message: 'Please enter a valid X (Twitter) URL'
    }
  }
}

/**
 * Validates if a form field has errors and returns the error message
 */
export function getFieldError(errors: Record<string, { message?: string }>, fieldName: string): string | undefined {
  return errors[fieldName]?.message
}

/**
 * Checks if a form has any validation errors
 */
export function hasFormErrors(errors: Record<string, unknown>): boolean {
  return Object.keys(errors).length > 0
}
