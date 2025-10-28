# 🐾 Veterinaria System

Sistema de gestão veterinária com **Angular + Spring Boot + Keycloak + NGINX + Docker**.  
Projeto em desenvolvimento para controle de animais, tutores, médicos, vacinas e consultas.

---

## 🚀 Tecnologias

- **Frontend:** Angular + NGINX (SPA servida em HTTPS)
- **Backend:** Spring Boot (dois serviços: Sistema 1 e Sistema 2)
- **Auth:** Keycloak (realm `veterinaria`, client `veterinaria-frontend`)
- **Banco:** MariaDB
- **Infra:** Docker Compose

---

## 📂 Estrutura do Projeto


/frontend        → Angular + NGINX (servidor SPA e proxy) 
/veterinariaBack → Spring Boot backend (controllers, security, role converter) 
/nginx           → Configuração dos proxies HTTPS (system1 / system2) 
/docker-compose.yml

---

## 🔑 Autenticação e Autorização

- **Keycloak Realm:** `veterinaria`
- **Client:** `veterinaria-frontend`
- **Usuário de teste:** `admin1`
- **Roles configuradas:**
  - `ADMIN`
  - `USER_SISTEMA1`
  - `USER_SISTEMA2`
  - `USER_BASICO`

### 🔒 Backend
- Configurado como **Resource Server JWT**.
- Roles convertidas via `KeycloakRoleConverter` → `ROLE_ADMIN`, `ROLE_USER_SISTEMA1`, etc.
- Endpoints protegidos com `@PreAuthorize`.

Exemplo:
```java
@PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
@GetMapping("/api/animal")
public List<Animal> findAll() { ... }
```
🌐 NGINX
• 	system1.local.projetomensal.com.br → Backend 1 () + Keycloak ()
• 	system2.local.projetomensal.com.br → Backend 2 () + Keycloak ()
• 	localhost (dev) → Angular + proxy para backend e Keycloak
Configuração essencial:


🐞 Problemas Encontrados
1. 401 Unauthorized após alguns minutos
• 	Causa:  expira em 5 minutos.
• 	Solução: implementar refresh manual com  no .
2. Invalid CORS request
• 	Causa: uso de curingas () em CORS e falta de resposta ao preflight (OPTIONS).
• 	Solução: CORS centralizado no  + NGINX respondendo OPTIONS 204.
3. 401 constante mesmo com token válido
• 	Causa: backend configurado com  em vez de  (dentro do Docker).
• 	Solução: usar:

4. 403 Forbidden em endpoints
• 	Causa: role não presente no token ou não convertida.
• 	Solução: garantir roles no Keycloak e manter .

🧪 Teste de Sanidade de Roles
Endpoint temporário no backend:

• 	Com usuário  deve retornar algo como:


▶️ Como Rodar
1. 	Build backend

2. 	Subir containers

3. 	Acessar
• 	Frontend: https://system1.local.projetomensal.com.br
• 	Backend API: https://system1.local.projetomensal.com.br/api/animal
• 	Keycloak: https://system1.local.projetomensal.com.br/auth

📌 Próximos Passos
• 	[ ] Implementar refresh manual de token no .
• 	[ ] Validar roles no endpoint .
• 	[ ] Ajustar CORS no NGINX para responder OPTIONS corretamente.
• 	[ ] Documentar variáveis de ambiente no .
• 	[ ] Revisar rotas Angular + guards para todos os módulos.

👥 Para quem for continuar
• 	Primeiro: resolver o refresh do token (para acabar com os 401 após 5 minutos).
• 	Segundo: alinhar issuer/JWKS no backend ().
• 	Terceiro: garantir CORS no NGINX e no .
• 	Quarto: validar roles no  e ajustar .
