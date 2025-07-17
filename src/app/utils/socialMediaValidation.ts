// Validação de URLs de redes sociais
export const SOCIAL_MEDIA_VALIDATORS = {
  x: (url: string) => {
    const domains = ['twitter.com', 'x.com']
    return domains.some(domain => url.includes(domain))
  },
  instagram: (url: string) => {
    return url.includes('instagram.com')
  },
  youtube: (url: string) => {
    const domains = ['youtube.com', 'youtu.be']
    return domains.some(domain => url.includes(domain))
  },
  tiktok: (url: string) => {
    return url.includes('tiktok.com')
  },
  snapchat: (url: string) => {
    return url.includes('snapchat.com')
  },
  facebook: (url: string) => {
    const domains = ['facebook.com', 'fb.com']
    return domains.some(domain => url.includes(domain))
  },
  linkedin: (url: string) => {
    return url.includes('linkedin.com')
  },
  pinterest: (url: string) => {
    return url.includes('pinterest.com')
  },
  twitch: (url: string) => {
    return url.includes('twitch.tv')
  }
}

export function validateSocialMediaUrl(platform: keyof typeof SOCIAL_MEDIA_VALIDATORS, url: string): boolean {
  if (!url || url.trim() === '') return true // URL vazia é válida (opcional)
  
  try {
    // Primeiro, verifica se é uma URL válida
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    new URL(normalizedUrl)
    
    // Depois, verifica se é do domínio correto
    const validator = SOCIAL_MEDIA_VALIDATORS[platform]
    return validator ? validator(normalizedUrl.toLowerCase()) : false
  } catch {
    return false
  }
}

export function getSocialMediaErrorMessage(platform: string): string {
  const platformMessages: Record<string, string> = {
    x: 'Please enter a valid X (Twitter) URL',
    instagram: 'Please enter a valid Instagram URL',
    youtube: 'Please enter a valid YouTube URL',
    tiktok: 'Please enter a valid TikTok URL',
    snapchat: 'Please enter a valid Snapchat URL',
    facebook: 'Please enter a valid Facebook URL',
    linkedin: 'Please enter a valid LinkedIn URL',
    pinterest: 'Please enter a valid Pinterest URL',
    twitch: 'Please enter a valid Twitch URL'
  }
  
  return platformMessages[platform] || 'Please enter a valid URL for this social media platform'
}
