import { PlusIcon } from '@heroicons/react/20/solid'
import { CameraIcon } from '@heroicons/react/24/outline'

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        <div className="text-center">
          <CameraIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />

          <h3 className="mt-2 text-sm font-semibold text-gray-900">No setups</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new setup.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAdd}
              className="cursor-pointer inline-flex items-center rounded-md bg-red-600 hover:bg-red-400 transition-all duration-300 hover:text-black px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <PlusIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
              New Setup
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )
}
