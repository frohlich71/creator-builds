# Configuração do Cloudinary para Upload de Imagens

Este guia detalha como configurar o Cloudinary para upload de imagens de perfil na aplicação Creator Builds com autenticação segura.

## Passo 1: Criar Conta no Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita (oferece 25GB de armazenamento e 25GB de largura de banda por mês)
3. Confirme seu email

## Passo 2: Obter Configurações

No dashboard do Cloudinary, você encontrará:

1. **Cloud Name**: Nome único da sua conta (ex: `dexample123`)
2. **API Key**: Chave pública da API
3. **API Secret**: Chave secreta (mantenha segura - será usada no servidor)

⚠️ **Importante**: A API Secret deve ser mantida apenas no servidor e nunca exposta no frontend.

## Passo 3: Configuração de Upload Autenticado

Esta aplicação usa upload **autenticado** (não unsigned) para maior segurança:

1. **Frontend**: Solicita uma assinatura do servidor
2. **Backend**: Gera assinatura usando API Secret  
3. **Frontend**: Usa a assinatura para upload seguro

### Vantagens do Upload Autenticado:
- ✅ Maior segurança - API Secret não exposta
- ✅ Controle total sobre uploads
- ✅ Validação server-side
- ✅ Proteção contra uploads não autorizados

## Passo 4: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas configurações:

```env
# Cloudinary Configuration (Client-side - para preview)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset_aqui

# Cloudinary API Configuration (Server-side only - MANTENHA SEGURO)
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui  
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=sua_api_secret_aqui

# NextAuth Configuration
NEXTAUTH_SECRET=seu_secret_muito_seguro_aqui
NEXTAUTH_URL=http://localhost:3002

# API Configuration  
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

⚠️ **Segurança**: As variáveis `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` são usadas apenas no servidor e nunca enviadas ao cliente.

## Passo 5: Como Funciona o Upload Autenticado

### Fluxo do Upload:

1. **Usuário seleciona imagem** → Frontend valida arquivo
2. **Frontend solicita assinatura** → `POST /api/cloudinary/signature`
3. **Backend gera assinatura** → Usando API Secret (seguro)
4. **Frontend faz upload** → Para Cloudinary com assinatura
5. **Cloudinary valida** → Assinatura e processa imagem
6. **Retorna URL segura** → Frontend atualiza preview

### Vantagens da Arquitetura:
- 🔒 **Segurança**: API Secret nunca exposta
- ⚡ **Performance**: Upload direto para Cloudinary  
- 🎯 **Controle**: Validação tanto no frontend quanto backend
- 📱 **UX**: Preview imediato durante upload

## Passo 6: Configurações de Segurança

Para maior segurança em produção:

### 1. Transformações Automáticas
O sistema aplica automaticamente:
- **Redimensionamento**: 400x400px
- **Qualidade**: Automática (otimizada)
- **Formato**: Automático (WebP quando suportado)
- **Pasta**: `profiles` (organização)

### 2. Validações Server-side
A rota `/api/cloudinary/signature` valida:
- ✅ Configuração completa do Cloudinary
- ✅ Parâmetros de upload válidos
- ✅ Assinatura criptográfica

### 3. Validações Client-side
O componente `ImageUpload` valida:
- ✅ Tipo de arquivo (apenas imagens)
- ✅ Tamanho máximo (10MB)
- ✅ Preview antes do upload
- ✅ Tratamento de erros

### 4. Domínios Permitidos (Produção)
Em **Settings** > **Security**:
- Adicione seus domínios de produção
- Ex: `seudominio.com`, `app.seudominio.com`
- Remove `localhost` em produção

## Passo 7: Testar Upload

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a página de registro: `http://localhost:3002/register`
3. Teste o upload de uma imagem
4. Verifique no dashboard do Cloudinary se a imagem foi enviada para a pasta `profiles`
5. Confirme que a URL retornada inclui as transformações automáticas

### Debugging
Se houver problemas, verifique:
- ✅ Todas as variáveis de ambiente estão configuradas
- ✅ API Key e Secret estão corretas
- ✅ Cloud Name corresponde ao da conta
- ✅ Console do navegador para erros JavaScript
- ✅ Logs do servidor Next.js

## Estrutura de URLs

As imagens no Cloudinary seguem o padrão:
```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
```

Exemplo:
```
https://res.cloudinary.com/dexample123/image/upload/w_400,h_400,c_fill,q_auto,f_auto/profiles/abcd1234.jpg
```

## Transformações Comuns

### Avatar pequeno (64x64):
```
w_64,h_64,c_fill,q_auto,f_auto
```

### Avatar médio (128x128):
```
w_128,h_128,c_fill,q_auto,f_auto
```

### Avatar grande (400x400):
```
w_400,h_400,c_fill,q_auto,f_auto
```

## Monitoramento

No dashboard do Cloudinary você pode:
- Visualizar todas as imagens enviadas
- Monitorar uso de armazenamento e banda
- Ver estatísticas de transformações
- Gerenciar imagens (deletar, editar, etc.)

## Troubleshooting

### Erro de CORS
Se aparecer erro de CORS, verifique se o domínio está permitido nas configurações de segurança.

### Upload Preset não encontrado
Certifique-se de que:
1. O preset foi criado corretamente
2. O nome no `.env.local` está correto
3. O preset está configurado como "Unsigned"

### Imagens não carregando
Verifique se:
1. A URL da imagem está correta
2. As transformações são válidas
3. A imagem existe no Cloudinary

### Quota excedida
O plano gratuito tem limites. Monitore o uso no dashboard e considere upgrade se necessário.

## Próximos Passos

1. **Backend Integration**: Salvar URLs das imagens no banco de dados
2. **Compressão**: Implementar compressão adicional para imagens grandes
3. **Fallbacks**: Adicionar imagens padrão para usuários sem foto
4. **Cache**: Implementar cache para URLs de imagens
5. **CDN**: Configurar CDN para melhor performance global

## Recursos Úteis

- [Documentação Cloudinary](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Transformações](https://cloudinary.com/documentation/image_transformations)
- [Preços](https://cloudinary.com/pricing)
