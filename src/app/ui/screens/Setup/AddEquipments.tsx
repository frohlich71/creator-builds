import { MinusIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, FieldErrors, useWatch } from "react-hook-form";
import { SetupForm } from "./CreateSetupForm";
import FloatingInput from "../../components/FloatingInput";
import ComboWithImage from "../../components/ComboWithImage";
import { useState, useEffect } from "react";

// Estrutura de dados para os ícones de equipamentos
const EQUIPMENT_ICONS = [
  { id: "monitor", name: "Monitor", imageUrl: "/icons/monitor.png" },
  { id: "keyboard", name: "Keyboard", imageUrl: "/icons/keyboard.png" },
  { id: "mouse", name: "Mouse", imageUrl: "/icons/mouse.png" },
  { id: "headset", name: "Headset", imageUrl: "/icons/headset.png" },
  { id: "speakers", name: "Speakers", imageUrl: "/icons/speakers.png" },
  { id: "camera", name: "Camera", imageUrl: "/icons/camera.png" },
  { id: "joystick", name: "Joystick", imageUrl: "/icons/joystick.png" },
  { id: "laptop", name: "Laptop", imageUrl: "/icons/laptop.png" },
  { id: "printer", name: "Printer", imageUrl: "/icons/printer.png" },
  { id: "light", name: "Light", imageUrl: "/icons/light.png" },
  { id: "cable", name: "Cable", imageUrl: "/icons/cable.png" },
  { id: "other", name: "Other", imageUrl: "/icons/other.png" },
];

export default function AddEquipments({control, register, setValue, errors}: {
  control: Control<SetupForm>, 
  register: UseFormRegister<SetupForm>,
  setValue: UseFormSetValue<SetupForm>,
  errors: FieldErrors<SetupForm>
}) {
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'equipments',
  });

  // Estado para controlar os ícones selecionados
  const [selectedIcons, setSelectedIcons] = useState<(typeof EQUIPMENT_ICONS[0] | null)[]>(
    fields.map(() => null)
  );

  // Watch dos valores dos ícones no formulário para sincronizar o estado
  const watchedIcons = useWatch({
    control,
    name: 'equipments'
  });

  // Sincronizar selectedIcons com os valores do formulário (para casos de edição)
  useEffect(() => {
    if (watchedIcons) {
      const newSelectedIcons = watchedIcons.map(equipment => {
        if (equipment?.icon) {
          return EQUIPMENT_ICONS.find(icon => icon.id === equipment.icon) || null;
        }
        return null;
      });
      setSelectedIcons(newSelectedIcons);
    }
  }, [watchedIcons]);

  function handleAppend() {
    append({ name: '', brand: '', model: '', icon: '', link: '' });
    setSelectedIcons(prev => [...prev, null]);
  }
  
  function handleRemove(index: number) {
    remove(index);
    setSelectedIcons(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="divide-y mt-6 divide-gray-200 overflow-visible rounded-lg bg-white shadow-md">
      <div className="px-4 py-2 sm:px-6">
        <div>
          <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="mt-2 ml-4">
              <h3 className="text-base font-semibold text-gray-900">Equipments</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {fields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg"> 
            <div className="grid grid-cols-12 gap-4">
              {/* Primeira linha: Nome, Marca, Modelo */}
              <div className="col-span-12 sm:col-span-4">
                <FloatingInput
                  id={`equipments.${index}.name`}
                  label="Equipment Name (Nickname)"
                  register={register(`equipments.${index}.name`, {
                    required: "Equipment name is required",
                    minLength: { value: 1, message: "Equipment name cannot be empty" }
                  })}
                />
                {errors.equipments?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.name?.message}</p>
                )}
              </div>
              
              <div className="col-span-12 sm:col-span-4">
                <FloatingInput
                  id={`equipments.${index}.brand`}
                  label="Brand"
                  register={register(`equipments.${index}.brand`, {
                    required: "Brand is required",
                    minLength: { value: 1, message: "Brand cannot be empty" }
                  })}
                />
                {errors.equipments?.[index]?.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.brand?.message}</p>
                )}
              </div>
              
              <div className="col-span-12 sm:col-span-4">
                <FloatingInput
                  id={`equipments.${index}.model`}
                  label="Model"
                  register={register(`equipments.${index}.model`, {
                    required: "Model is required",
                    minLength: { value: 1, message: "Model cannot be empty" }
                  })}
                />
                {errors.equipments?.[index]?.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.model?.message}</p>
                )}
              </div>
              
              {/* Segunda linha: Ícone, Link, Botões */}
              <div className="col-span-12 sm:col-span-3">
                <ComboWithImage
                  options={EQUIPMENT_ICONS}
                  value={selectedIcons[index]}
                  onChange={(selectedIcon) => {
                    const newSelectedIcons = [...selectedIcons];
                    newSelectedIcons[index] = selectedIcon;
                    setSelectedIcons(newSelectedIcons);
                    
                    // Atualiza o valor no formulário
                    setValue(`equipments.${index}.icon`, selectedIcon ? selectedIcon.id : '');
                  }}
                  label="Icon *"
                  getLabel={(item) => item.name}
                  getImageUrl={(item) => item.imageUrl}
                  placeholder="Select an icon..."
                />
                
                {/* Hidden input para validação */}
                <input
                  type="hidden"
                  {...register(`equipments.${index}.icon`, {
                    required: "Icon is required"
                  })}
                  value={selectedIcons[index]?.id || ''}
                />
                
                {errors.equipments?.[index]?.icon && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.icon?.message}</p>
                )}
              </div>
              
              <div className="col-span-12 sm:col-span-7">
                <div className="relative">
                  <FloatingInput
                    id={`equipments.${index}.link`}
                    label="Product Link *"
                    register={register(`equipments.${index}.link`, {
                      required: "Product link is required",
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Please enter a valid URL starting with http:// or https://"
                      }
                    })}
                  />
                  <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.equipments?.[index]?.link && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.link?.message}</p>
                )}
              </div>
              
              <div className="col-span-12 sm:col-span-2 flex items-start justify-end">
                <button
                  type="button"
                  onClick={() => handleAppend()}
                  className="rounded-sm cursor-pointer transition-all duration-300 bg-green-200 px-2 py-1 text-xs font-semibold text-black shadow-xs hover:bg-green-100"
                >
                  <PlusIcon aria-hidden="true" className="h-5 w-5" />
                </button>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded-sm ml-2 cursor-pointer transition-all duration-300 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-100"
                  >
                    <MinusIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}