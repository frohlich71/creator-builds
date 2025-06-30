import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { SetupForm } from "./CreateSetupForm";
import FloatingInput from "../../components/FloatingInput";
import ComboWithImage from '../../components/ComboWithImage';
import { useState } from 'react';
import { useProductService } from '../../../service/useProductService';
import { Product } from '@/types/product';


export default function AddEquipments({control, register, setValue, errors}: {
  control: Control<SetupForm>, 
  register: UseFormRegister<SetupForm>, 
  setValue: UseFormSetValue<SetupForm>,
  errors: FieldErrors<SetupForm>
}) {
  
  const productService = useProductService();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'equipments',
  });

  // Estado para produtos buscados e seleção
  const [productOptions, setProductOptions] = useState<Product[][]>(fields.map(() => []));
  const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>(fields.map(() => null));

  // Atualiza os estados ao adicionar/remover campos
  function handleAppend() {
    append({ name: '', asin: '' });
    setProductOptions((opts) => [...opts, []]);
    setSelectedProducts((sel) => [...sel, null]);
  }
  function handleRemove(index: number) {
    remove(index);
    setProductOptions((opts) => opts.filter((_, i) => i !== index));
    setSelectedProducts((sel) => sel.filter((_, i) => i !== index));
  }

  // Busca produtos conforme digitação
  async function handleProductSearch(index: number, query: string) {
    if (query.length < 2) {
      setProductOptions((opts) => opts.map((arr, i) => i === index ? [] : arr));
      return;
    }
    let products = await productService.searchByTitle(query, 10);
    // Garante que cada produto tenha o campo id preenchido com asin
    products = products.map((p: Product) => ({ ...p, id: p.asin }));
    setProductOptions((opts) => opts.map((arr, i) => i === index ? products : arr));
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
          <div key={field.id} className="mb-4"> 
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-4">
                <FloatingInput
                  id={`equipments.${index}.name`}
                  label="Name"
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
                <ComboWithImage
                  options={productOptions[index]}
                  value={selectedProducts[index]}
                  onChange={(product) => {
                    setSelectedProducts((prev) => prev.map((p, i) => i === index ? product : p));
                    if (product) {
                      setValue(`equipments.${index}.asin`, product.asin);
                    }
                  }}
                  label="Item"
                  getLabel={(item) => item.title}
                  getImageUrl={(item) => item.imgUrl || ''}
                  placeholder="Search item..."
                  onInputChange={(query) => handleProductSearch(index, query)}
                />
                {/* Hidden input para validação do ASIN */}
                <input
                  type="hidden"
                  {...register(`equipments.${index}.asin`, {
                    required: "You must select an item from the list"
                  })}
                />
                {errors.equipments?.[index]?.asin && (
                  <p className="mt-1 text-sm text-red-600">{errors.equipments[index]?.asin?.message}</p>
                )}
              </div>
              <div className="col-span-12 sm:col-span-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleAppend()}
                  className="rounded-sm cursor-pointer transition-all duration-300 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-100"
                >
                  <PlusIcon aria-hidden="true" className=" size-5" />
                </button>

                {fields.length > 1 && (
                  <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-sm ml-2 cursor-pointer transition-all duration-300 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-100"
                >
                  <MinusIcon aria-hidden="true" className=" size-5" />
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