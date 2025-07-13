# Equipment Icons

Esta pasta contém os ícones para os equipamentos no formulário de setup.

## Estrutura de Arquivos Necessários

Para que os ícones funcionem corretamente, você deve adicionar as seguintes imagens nesta pasta:

```
/public/icons/
├── monitor.png      # Ícone para monitores
├── keyboard.png     # Ícone para teclados
├── mouse.png        # Ícone para mouse
├── headphones.png   # Ícone para fones de ouvido
├── speakers.png     # Ícone para caixas de som
├── camera.png       # Ícone para câmeras
├── controller.png   # Ícone para controles/gamepads
├── laptop.png       # Ícone para laptops
├── printer.png      # Ícone para impressoras
├── phone.png        # Ícone para telefones
├── watch.png        # Ícone para relógios/smartwatches
├── light.png        # Ícone para iluminação
├── cable.png        # Ícone para cabos
├── storage.png      # Ícone para armazenamento
└── other.png        # Ícone genérico para outros equipamentos
```

## Recomendações

- **Formato**: PNG com fundo transparente
- **Tamanho**: 64x64 pixels ou 128x128 pixels
- **Estilo**: Consistente entre todos os ícones
- **Cores**: Preferencialmente em tons neutros ou seguindo a paleta do projeto

## Como Atualizar

Para adicionar novos tipos de equipamentos:

1. Adicione a nova imagem na pasta `/public/icons/`
2. Edite o arquivo `/src/app/ui/screens/Setup/AddEquipments.tsx`
3. Adicione o novo item no array `EQUIPMENT_ICONS`:

```typescript
{ id: "novo-equipamento", name: "Nome do Equipamento", imageUrl: "/icons/novo-equipamento.png" }
```

## Fontes de Ícones Recomendadas

- [Heroicons](https://heroicons.com/) - Ícones em SVG
- [Feather Icons](https://feathericons.com/) - Ícones minimalistas
- [Phosphor Icons](https://phosphoricons.com/) - Ícones modernos
- [Tabler Icons](https://tabler-icons.io/) - Ícones para UI
