'use client'

import { useForm } from "react-hook-form";
import FloatingInput from "../../components/FloatingInput";
import AddEquipments from "./AddEquipments";
import { useSetupService } from "@/app/service/useSetupService";
import NProgress from 'nprogress';
import { useNotificationContext } from "@/app/contexts/NotificationContext";


export type EquipmentDTO = {
  name: string;
  asin: string;
};
export type SetupForm = {
  setupName: string;
  equipments: EquipmentDTO[];
};

export default function CreateSetupForm({ onCancel }: { onCancel: () => void }) {

  const setupService = useSetupService();
  const {showError} = useNotificationContext();

  const { register, control, handleSubmit, setValue } = useForm<SetupForm>({
    defaultValues: {
      setupName: "",
      equipments: [{ name: "", asin: "" }],
    },
  });
  

  function onSubmit(data: SetupForm) {
    NProgress.start();
    
    setupService.createSetup({
      name: data.setupName,
      equipments: data.equipments
    })
      .then(() => {
        NProgress.done();
        // Adicionar parâmetro na URL para mostrar notificação após reload
        const url = new URL(window.location.href);
        url.searchParams.set('notification', 'success');
        url.searchParams.set('setupName', data.setupName);
        window.location.href = url.toString();
      })
      .catch((err) => {
        console.error("Error creating setup:", err);
        showError("Erro ao criar setup", "Não foi possível criar o setup. Tente novamente.");
        NProgress.done();
      });
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FloatingInput
        id="setupName"
        
        label="Setup name"
        register={register("setupName", { required: true })}
      />

      <AddEquipments control={control} register={register} setValue={setValue}/>
      <div className="flex gap-4 justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm cursor-pointer transition-all duration-300 bg-rose-50 px-2 py-1 text-sm font-semibold text-rose-600 shadow-xs hover:bg-rose-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-sm cursor-pointer transition-all duration-300 bg-rose-600 px-2 py-1 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-rose-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}