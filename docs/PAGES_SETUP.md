# Configuração do GitHub Pages

Este guia ajuda a resolver erros de deploy no workflow de GitHub Pages.

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| Get Pages site failed / Not Found | Pages não habilitado no repositório | Siga os passos abaixo |
| Create Pages site failed / Resource not accessible by integration | GITHUB_TOKEN sem permissão para criar Pages | Habilite Pages manualmente (passos abaixo) |

## Passos para habilitar o GitHub Pages

1. **Abra as configurações do repositório**
   - No GitHub, vá até o repositório
   - Clique em **Settings** (Configurações)

2. **Acesse a seção Pages**
   - No menu lateral esquerdo, role até **Code and automation**
   - Clique em **Pages**

3. **Configure a origem**
   - Em **Build and deployment** → **Source**
   - Selecione **GitHub Actions** no dropdown
   - Não é necessário selecionar branch ou pasta - o workflow faz o deploy

4. **Execute o workflow novamente**
   - Vá em **Actions** e execute o workflow manualmente (Run workflow)
   - Ou faça um novo push na branch main

## Requisitos

- Você precisa ter permissão de **admin** ou **write** no repositório para alterar as configurações de Pages
- Em repositórios de organização, Pages pode estar restrito - verifique com o administrador
