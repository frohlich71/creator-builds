'use client'

import { useForm } from "react-hook-form";
import FloatingInput from "../../components/FloatingInput";
import AddEquipments from "./AddEquipments";
import { useSetupService } from "@/app/service/useSetupService";
import NProgress from 'nprogress';
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useEffect } from "react";
import { Setup } from "@/types/setup";

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

export default function EditSetupForm({ 
  setup, 
  onCancel
}: { 
  setup: Setup;
  onCancel: () => void;
}) {

  const setupService = useSetupService();
  const {showError} = useNotificationContext();

  const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm<SetupForm>({
    defaultValues: {
      setupName: "",
      equipments: [{ name: "", brand: "", model: "", icon: "", link: "" }],
    },
  });

  // Preencher o formulário com os dados do setup atual
  useEffect(() => {
    if (setup) {
      reset({
        setupName: setup.name,
        equipments: setup.equipments.length > 0 
          ? setup.equipments.map(equipment => ({
              name: equipment.name || "",
              brand: equipment.brand || "",
              model: equipment.model || "",
              icon: equipment.icon || "",
              link: equipment.link || "",
            }))
          : [{ name: "", brand: "", model: "", icon: "", link: "" }]
      });
    }
  }, [setup, reset]);

  async function onSubmit(data: SetupForm) {
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
    
    try {
      await setupService.updateSetup(setup._id, {
        name: data.setupName,
        equipments: data.equipments
      });
      
      NProgress.done();
      
      // Adicionar parâmetro na URL para mostrar notificação após reload
      const url = new URL(window.location.href);
      url.searchParams.set('notification', 'success');
      url.searchParams.set('setupName', data.setupName);
      url.searchParams.set('action', 'updated');
      window.location.href = url.toString();
    } catch (err) {
      console.error("Error updating setup:", err);
      showError("Error updating setup", "There was an error updating the setup. Please try again.");
      NProgress.done();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="px-4 py-5 sm:px-6">
          <div>
            <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="mt-2 ml-4">
                <h3 className="text-base font-semibold text-gray-900">Edit Setup</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your setup name and modify your equipment list.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <FloatingInput
                id="setupName"
                label="Setup Name"
                register={register("setupName", {
                  required: "Setup name is required",
                  minLength: { value: 3, message: "Setup name must be at least 3 characters long" }
                })}
              />
              {errors.setupName && (
                <p className="mt-1 text-sm text-red-600">{errors.setupName.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEquipments control={control} register={register} setValue={setValue} errors={errors}/>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
