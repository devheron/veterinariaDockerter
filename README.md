# 🐾 VetSys - Sistema Veterinário com Autenticação Centralizada

Sistema veterinário desenvolvido com Angular, Spring Boot, MariaDB e Keycloak, com TLS em todos os componentes.

---

## 📋 Pré-requisitos

- **Docker Desktop** instalado e rodando
- **Git** instalado
- **Windows 10/11** (ou adaptar comandos para Linux/Mac)

---

## 🚀 Instalação e Configuração

### **Passo 1: Clonar o Repositório**

```powershell
cd C:\Users\SEU_USUARIO\Documents
git clone https://github.com/carolbuenodavalos/veterinariaDocker.git
cd veterinariaDocker
```

---

### **Passo 2: Configurar Domínios no Hosts**

**⚠️ IMPORTANTE:** Execute o PowerShell **como Administrador**

```powershell
# Abrir arquivo hosts como administrador
notepad C:\Windows\System32\drivers\etc\hosts
```

**Adicione estas linhas no final do arquivo:**

```
127.0.0.1 system1.local.projetomensal.com.br
127.0.0.1 system2.local.projetomensal.com.br
```

**Salve e feche o arquivo.**

---

### **Passo 3: Iniciar os Containers**

```powershell
# Voltar para a pasta do projeto
cd C:\Users\SEU_USUARIO\Documents\veterinariaDocker

# Subir todos os containers
docker-compose up -d

# Verificar se todos subiram
docker-compose ps
```

**Aguarde 2-3 minutos** para todos os serviços iniciarem completamente.

---

### **Passo 4: Configurar Keycloak (IMPORTANTE!)**

#### **4.1 - Criar Roles**

#### **4.2 - Criar Usuários**


#### **4.3 - Definir Senhas**


#### **4.4 - Atribuir Roles aos Usuários**

Acesse o **Keycloak Admin Console:**
- URL: `http://localhost:8180/admin`
- Login: `admin`
- Senha: `admin`


---

## 🔑 Credenciais

### **Usuários da Aplicação (Login no Sistema)**

| Usuário | Senha | Role | Acesso |
|---------|-------|------|--------|
| `admin1` | `Admin@123` | ADMIN | Acesso total a ambos os sistemas |
| `usuario_basico` | `Basico@123` | USER_BASICO | Visualização básica em ambos |
| `usuario_sistema1` | `Sistema1@123` | USER_SISTEMA1 | Acesso completo apenas ao Sistema 1 |
| `usuario_sistema2` | `Sistema2@123` | USER_SISTEMA2 | Acesso completo apenas ao Sistema 2 |

### **Banco de Dados MariaDB**

| Item | Valor |
|------|-------|
| Host | `localhost:3307` |
| Usuário Sistema 1 | `veter_s1` |
| Senha Sistema 1 | `veter_s1_pass` |
| Database Sistema 1 | `veterinaria_s1` |
| Usuário Sistema 2 | `veter_s2` |
| Senha Sistema 2 | `veter_s2_pass` |
| Database Sistema 2 | `veterinaria_s2` |
| Root | `root` / `root123` |

### **Keycloak Admin**

| Item | Valor |
|------|-------|
| URL Admin | `http://localhost:8180/admin` |
| Usuário | `admin` |
| Senha | `admin` |
| Realm | `veterinaria` |

---

## 🌐 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Sistema (HTTPS)** | `https://localhost` | Frontend Angular (aceitar certificado auto-assinado) |
| **Sistema (HTTP)** | `http://localhost:4200` | Frontend Angular (alternativa) |
| **Sistema 1 (HTTPS)** | `https://system1.local.projetomensal.com.br` | Domínio Sistema 1 |
| **Backend 1 API** | `http://localhost:8080` | API Spring Boot Sistema 1 |

| **MariaDB** | `localhost:3307` | Banco de dados |
| **Keycloak** | `http://localhost:8180` | Servidor de autenticação |
| **Keycloak Admin** | `http://localhost:8180/admin` | Console administrativo |

---

## 🧪 Testando a Instalação

### **1. Verificar Containers**

```powershell
docker-compose ps
```

**Todos devem estar "Up":**
- `veterinaria-web` (Nginx)
- `veterinaria-frontend` (Angular)
- `veterinaria-backend` (Spring Boot Sistema 1)
- `veterinaria-backend2` (Spring Boot Sistema 2)
- `veterinaria-db` (MariaDB)
- `veterinaria-keycloak` (Keycloak)

### **2. Testar Login**

1. Abra `https://localhost` no navegador
2. Aceite o certificado auto-assinado (clique em "Avançado" → "Continuar")
3. Faça login com algum usuario criado no keycloak
4. Deve aparecer o dashboard ✅

### **3. Testar Controle de Acesso**

**Login como `usuario_sistema1`:**
- ✅ Consegue acessar Animais e Tutores
- ❌ Bloqueado em Médicos, Vacinas e Consultas

**Login como `usuario_sistema2`:**
- ❌ Bloqueado em Animais e Tutores
- ✅ Consegue acessar Médicos, Vacinas e Consultas

---

## 🔧 Comandos Úteis

### **Ver Logs de um Container**

```powershell
# Logs do backend
docker logs veterinaria-backend

# Logs do Keycloak
docker logs veterinaria-keycloak

# Logs do Nginx
docker logs veterinaria-web

# Logs do MariaDB
docker logs veterinaria-db
```

### **Reiniciar um Container**

```powershell
# Reiniciar tudo
docker-compose restart

# Reiniciar apenas um serviço
docker-compose restart backend
```

### **Parar Tudo**

```powershell
docker-compose down
```

### **Reconstruir e Reiniciar**

```powershell
docker-compose up -d --build
```

---

## 🛡️ Segurança Implementada

✅ **TLS/HTTPS:**
- Nginx com certificado wildcard
- HTTP/2 habilitado
- HSTS configurado

✅ **MariaDB:**
- TLS obrigatório (`require_secure_transport=ON`)
- Certificados SSL configurados

✅ **Keycloak:**
- Autenticação centralizada OAuth2/OIDC
- JWT tokens com roles
- Resource Owner Password Credentials Grant

✅ **Headers de Segurança:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Strict-Transport-Security` (HSTS)

---

## 📁 Estrutura do Projeto

```
veterinariaDocker/
├── docker-compose.yml          # Orquestração dos containers
├── nginx-conf/
│   └── default.conf            # Configuração Nginx (HTTPS, proxy)
├── ssl-projetomensal.com.br/   # Certificados TLS
│   ├── fullchain.pem
│   └── wildcard.key
├── veterinaria-master/         # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── guards/
│   │   │   │   └── role.guard.ts    # Controle de acesso por roles
│   │   │   ├── services/
│   │   │   │   └── keycloak.service.ts
│   │   │   └── components/
│   │   └── ...
│   └── Dockerfile
├── veterinariaBack-master/     # Backend Sistema 1 (Spring Boot)
│   ├── src/main/java/...
│   └── Dockerfile
└── README.md                   # Este arquivo
```

---

## ❓ Problemas Comuns

### **Erro: "Cannot connect to Docker daemon"**
- Certifique-se que o Docker Desktop está rodando

### **Erro 404 ao acessar https://localhost**
- Aguarde 2-3 minutos após `docker-compose up -d`
- Verifique se o container `veterinaria-web` está "Up"

### **Login não funciona**
- Verifique se executou os comandos do **Passo 4** (Keycloak)
- Verifique se as roles foram atribuídas aos usuários

### **"Acesso Negado" no sistema**
- Verifique se o usuário tem a role correta
- Verifique no Console do navegador (F12) se há erros

---


