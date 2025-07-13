'use client'

import { useForm } from "react-hook-form";
import FloatingInput from "../../components/FloatingInput";
import AddEquipments from "./AddEquipments";
import { useSetupService } from "@/app/service/useSetupService";
import NProgress from 'nprogress';
import { useNotificationContext } from "@/app/contexts/NotificationContext";


export type EquipmentDTO = {
  name: string;        // apelido
  brand: string;       // marca
  model: string;       // modelo
  icon: string;        // ícone (obrigatório)
  link: string;        // link (obrigatório)
};
export type SetupForm = {
  setupName: string;
  equipments: EquipmentDTO[];
};

export default function CreateSetupForm({ onCancel }: { onCancel: () => void }) {

  const setupService = useSetupService();
  const {showError} = useNotificationContext();

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<SetupForm>({
    defaultValues: {
      setupName: "",
      equipments: [{ name: "", brand: "", model: "", icon: "", link: "" }],
    },
    mode: 'onChange'
  });
  

  function onSubmit(data: SetupForm) {
    // Validação: verificar se há pelo menos um equipamento
    if (!data.equipments || data.equipments.length === 0) {
      showError("Validation Error", "You must add at least one equipment to create a setup.");
      return;
    }

    // Validação: verificar se todos os equipamentos têm campos obrigatórios preenchidos
    const hasEmptyFields = data.equipments.some(equipment => 
      !equipment.name.trim() || !equipment.brand.trim() || !equipment.model.trim() || 
      !equipment.icon.trim() || !equipment.link.trim()
    );

    if (hasEmptyFields) {
      showError("Validation Error", "All equipment fields (name, brand, model, icon, and link) must be filled.");
      return;
    }

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
        showError("Error creating setup", "There was an error creating the setup. Please try again.");
        NProgress.done();
      });
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FloatingInput
        id="setupName"
        label="Setup name"
        register={register("setupName", { 
          required: "Setup name is required",
          minLength: { value: 1, message: "Setup name cannot be empty" }
        })}
      />
      {errors.setupName && (
        <p className="mt-1 text-sm text-red-600">{errors.setupName.message}</p>
      )}

      <AddEquipments control={control} register={register} setValue={setValue} errors={errors}/>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto order-2 sm:order-1 rounded-md cursor-pointer transition-all duration-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto order-1 sm:order-2 rounded-md cursor-pointer transition-all duration-300 bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Save Setup
        </button>
      </div>
    </form>
  )
}