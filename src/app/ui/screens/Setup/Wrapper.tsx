"use client"; // no SetupEmptyState
import { useState } from 'react';
import EmptyState from '@/app/ui/screens/Setup/EmptyState';
import CreateSetupForm from './CreateSetupForm';
import { Setup } from '@/types/setup';
import Equipments from '../../components/Equipments';
import Button from '../../components/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSetupService } from '@/app/service/useSetupService';
import NProgress from 'nprogress';
import { useNotificationContext } from '@/app/contexts/NotificationContext';


export default function SetupWrapper({setups, isOwner = false}: {setups: Setup[], isOwner?: boolean}) {

  const [showForm, setShowForm] = useState(false);
  const { deleteSetup } = useSetupService();
  const { showError } = useNotificationContext();

  function handleDeleteSetup(setupId: string) {
    NProgress.start();
    
    deleteSetup(setupId)
      .then(() => {
        NProgress.done();
        // Adicionar parâmetro na URL para mostrar notificação após reload
        const url = new URL(window.location.href);
        url.searchParams.set('notification', 'success');
        url.searchParams.set('message', encodeURIComponent('Setup deleted successfully'));
        window.location.href = url.toString();
      })
      .catch((err) => {
        console.error("Error deleting setup:", err);
        showError("Erro ao deletar setup", "Não foi possível remover o setup. Tente novamente.");
        NProgress.done();
      });
  }
  
  return (
    <div className='grid grid-cols-1 gap-4 lg:col-span-2'>
      <section aria-labelledby="section-1-title">
        <h2 id="section-1-title" className="sr-only">
          Setups section
        </h2>
        
        <div>
          {setups.length > 0 ? setups.map((setup) => (
            <div key={setup._id} className="overflow-hidden rounded-lg mb-6 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex mb-2 items-center justify-between">
                  <h3 className="mt-2 ml-2 text-base font-semibold text-gray-900">{setup.name}</h3>
                  {isOwner && (
                    <div>
                      <Button variant='ghost' className='mr-2' onClick={() => handleDeleteSetup(setup._id)}>
                        <XMarkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className='border-b border-gray-300' />
                <Equipments equipments={setup.equipments} />
                
              </div>
            </div>
          )) : (
            <>
              {isOwner ? (
                <>
                  {showForm ? (
                    <CreateSetupForm onCancel={() => setShowForm(false)} />
                  ) : (
                    <EmptyState onAdd={() => setShowForm(true)} />
                  )}
                </>
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-md bg-white shadow-md">
                  <div className="mx-auto h-12 w-12 text-rose-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No setups yet</h3>
                  <p className="mt-1 text-sm text-gray-500">This creator hasn&apos;t shared any setups yet.</p>
                </div>
              )}
            </>
          )}

          {(showForm && setups.length > 0 && isOwner) && (
            <div className="mt-6 p-6 border border-gray-200 pt-6 rounded-lg bg-white shadow-sm">
              <CreateSetupForm onCancel={() => setShowForm(false)} />
            </div>
          )}

        </div>
        {(setups.length > 0 && isOwner) && (
          <div className="flex justify-end mt-4">
            <Button variant='primary' onClick={() => setShowForm(true)}>
              Add new setup
              <svg className=" h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </Button>
          </div>
        )} 
      </section>
    </div>
  );
}