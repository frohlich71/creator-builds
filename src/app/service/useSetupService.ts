import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi'

export interface CreateSetupDTO {
  name: string;
  ownerName?: string;
  equipments: {
    name: string;
    asin: string;
  }[];
}

export function useSetupService() {
  const {api, getSession} = useAuthenticatedApi()
  
  return {
    createSetup: async (setupData: CreateSetupDTO) => {
      setupData.ownerName = getSession().user?.name ?? '';

      const res = await api!.post('/setup', setupData)
      
      if (res.status !== 201 && res.status !== 200) {
        throw new Error('Failed to create setup');
      }

      return res.data
    },

    deleteSetup: async (setupId: string) => {
      const res = await api!.delete(`/setup/${setupId}`)
      if (res.status !== 200) {
        throw new Error('Failed to delete setup');
      }
      return true
    },
    getCurrentUser: () => {
      const session = getSession()
      return {
        name: session.user?.name,
        email: session.user?.email,
        accessToken: session.accessToken
      }
    }
  }
}