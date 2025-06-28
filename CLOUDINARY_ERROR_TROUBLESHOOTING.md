# Solução do Erro: "Configuração do Cloudinary não encontrada"

## Problema
```
Erro no registro: Error: Configuração do Cloudinary não encontrada
```

## Causa
As variáveis de ambiente do Cloudinary não estão configuradas no arquivo `.env.local`.

## Solução

### 1. Verificar se o arquivo `.env.local` existe
```bash
ls -la .env.local
```

Se não existir, crie baseado no `.env.example`:
```bash
cp .env.example .env.local
```

### 2. Configurar variáveis do Cloudinary no `.env.local`

Abra o arquivo `.env.local` e adicione/atualize as seguintes variáveis:

```env
# Cloudinary Configuration (Client-side)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset_aqui

# Cloudinary API Configuration (Server-side) - ADICIONE ESTAS LINHAS
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=sua_api_secret_aqui
```

### 3. Obter as credenciais no Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com) e faça login
2. No dashboard, você encontrará:
   - **Cloud name**: Nome da sua conta (ex: `dexample123`)
   - **API Key**: Chave pública (ex: `123456789012345`)
   - **API Secret**: Chave secreta (ex: `abcd1234efgh5678`) - ⚠️ **NUNCA exponha publicamente**

### 4. Exemplo de configuração completa

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dexample123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=creator_builds_profiles

# Cloudinary API Configuration (Server-side only)
CLOUDINARY_CLOUD_NAME=dexample123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcd1234efgh5678ijkl9012

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3002

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Reiniciar o servidor

Após configurar as variáveis, reinicie o servidor Next.js:

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 6. Verificar se funcionou

1. Abra o console do navegador (F12)
2. Tente fazer upload de uma imagem
3. Verifique os logs no terminal do servidor

Se estiver funcionando, você verá no terminal:
```
=== DEBUG: Variáveis de ambiente Cloudinary ===
CLOUDINARY_CLOUD_NAME: DEFINIDO
CLOUDINARY_API_KEY: DEFINIDO
CLOUDINARY_API_SECRET: DEFINIDO
✅ Assinatura gerada com sucesso
```

## Troubleshooting Adicional

### Erro persiste após configurar variáveis?

1. **Verifique se o arquivo `.env.local` está na raiz do projeto**
   ```
   projeto/
   ├── .env.local        ← Deve estar aqui
   ├── src/
   ├── package.json
   └── ...
   ```

2. **Certifique-se de que não há espaços extras nas variáveis**
   ```env
   # ❌ Errado (espaços extras)
   CLOUDINARY_CLOUD_NAME = dexample123
   
   # ✅ Correto
   CLOUDINARY_CLOUD_NAME=dexample123
   ```

3. **Verifique se as credenciais estão corretas no Cloudinary**
   - Faça login no dashboard do Cloudinary
   - Confirme que o Cloud Name, API Key e API Secret estão corretos

4. **Teste a rota de API diretamente**
   ```bash
   curl -X POST http://localhost:3002/api/cloudinary/signature \
     -H "Content-Type: application/json" \
     -d '{"folder":"profiles"}'
   ```

5. **Verifique os logs do servidor**
   - Procure por mensagens de erro no terminal onde o Next.js está rodando
   - Os logs de debug devem mostrar se as variáveis estão definidas

### Se ainda não funcionar

Verifique se:
- [ ] Arquivo `.env.local` existe na raiz do projeto
- [ ] Todas as 3 variáveis estão definidas (CLOUD_NAME, API_KEY, API_SECRET)
- [ ] Não há espaços extras nas definições
- [ ] Servidor foi reiniciado após alterar `.env.local`
- [ ] Credenciais estão corretas no dashboard do Cloudinary

## Segurança

⚠️ **IMPORTANTE**: 
- O arquivo `.env.local` deve estar no `.gitignore`
- NUNCA commite o arquivo `.env.local` no git
- A `CLOUDINARY_API_SECRET` deve ser mantida segura
- Use as variáveis `CLOUDINARY_*` apenas no servidor (sem `NEXT_PUBLIC_`)
