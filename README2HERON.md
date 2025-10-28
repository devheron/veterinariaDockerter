Visão geral
Este projeto é uma aplicação de gestão veterinária com:
• 	Frontend: Angular SPA servida por NGINX (HTTPS em domínios system1/system2).
• 	Backend: Spring Boot (dois serviços: backend e backend2) com JWT Resource Server.
• 	Auth: Keycloak (HTTP) via proxy NGINX em /auth para evitar CORS.
• 	Infra: Docker Compose com redes internas, NGINX como reverse proxy.

Estrutura
• 	frontend/: Angular app, NGINX conf serving SPA e proxy para /api e /auth.
• 	veterinariaBack/: Spring Boot backend (controllers, security, role converter).
• 	docker-compose.yml: Orquestra frontend, backends, Keycloak e DB.
• 	nginx/default.conf: Config dos servers HTTPS (system1/system2) e proxy.
• 	application.properties: Config do Spring (DB, JWT issuer/JWKS).

Como rodar
1. 	Configurar Keycloak
• 	Realm: veterinaria
• 	Client: veterinaria-frontend (public)
• 	Usuário de teste: admin1
• 	Roles de realm: ADMIN, USER_SISTEMA1, USER_SISTEMA2, USER_BASICO
• 	Habilite “Direct Access Grants” para permitir password grant.
2. 	Backend (Spring Boot)
• 	application.properties (modo Docker):

• 	Build:

3. 	Frontend (Angular)
• 	AnimalService chama:
• 	GET /api/animal
• 	GET /api/animal/{id}
• 	GET /api/animal/search?nome=...
• 	POST /api/animal
• 	PUT /api/animal/{id}
• 	DELETE /api/animal/{id}
• 	KeycloakService:
• 	Login via POST /auth/realms/veterinaria/protocol/openid-connect/token
• 	Guard e interceptor adicionam Authorization Bearer e renovam token.
4. 	NGINX (HTTPS)
• 	Servers:
• 	system1.local.projetomensal.com.br → proxy para backend (Sistema 1) e /auth → Keycloak
• 	system2.local.projetomensal.com.br → proxy para backend2 (Sistema 2) e /auth → Keycloak
• 	Responder OPTIONS 204 e repassar Authorization/Origin em /api.
5. 	Subir tudo com Docker


Segurança e autorização
• 	SecurityConfig:
• 	Stateless, JWT Resource Server, CORS centralizado (AllowedOriginPatterns).
• 	Endpoints /api/** autenticados e métodos com @PreAuthorize.
• 	KeycloakRoleConverter:
• 	Converte realm roles e client roles para ROLE_*.
• 	Exemplo @PreAuthorize:


Teste de sanidade de roles (debug)
• 	Backend (AnimalController):

• 	Frontend:

• 	Esperado com ADMIN: Authorities: [ROLE_ADMIN, …]. Se vier vazio, validar issuer/JWKS e acessibilidade ao Keycloak pelo hostname de rede Docker (keycloak:8080).

Problemas atuais e causas raiz
• 	401 Unauthorized após alguns minutos:
• 	Causa: access_token expira em ~300s e o refresh via keycloak-js não funciona bem no fluxo manual (password grant).
• 	Solução: implementar refresh manual com refresh_token (POST em /auth/.../token, grant_type=refresh_token) e usar no interceptor antes de cada request.
• 	Invalid CORS request ou preflight bloqueado:
• 	Causa: CORS permissivo com curingas (“*”) ou sem responder OPTIONS no NGINX; headers não preservados (Authorization/Origin).
• 	Solução: CORS no SecurityConfig com AllowedOriginPatterns; NGINX respondendo OPTIONS 204 e repassando Authorization/Origin em /api.
• 	401 constante mesmo com token:
• 	Causa: backend validando JWKS com  (inacessível de dentro do container) ou issuer diferente do iss do token.
• 	Solução: usar  em issuer/jwk-set-uri; garantir que o token iss corresponde.
• 	403 Forbidden em endpoints com @PreAuthorize:
• 	Causa: role não presente no token (ex.: USER_SISTEMA1 ausente) ou conversão de roles desativada.
• 	Solução: conferir roles no tokenParsed, garantir que o usuário tenha a role no Keycloak, manter KeycloakRoleConverter ativo.
• 	net::ERR_TIMED_OUT no browser:
• 	Causa: proxy NGINX não alcança backend, backend reiniciou ou host/porta incorretos.
• 	Solução: checar NGINX proxy_pass (http://backend:8080), saúde do container, rede docker.

O que falta fazer
• 	Implementar refresh manual de token no KeycloakService usando refresh_token e integrar no interceptor (antes de cada /api).
• 	Uniformizar issuer/JWKS no backend com  (sem localhost em Docker).
• 	Garantir CORS e preflight no NGINX com OPTIONS 204 e passagem de Authorization/Origin.
• 	Validar roles no endpoint /api/animal/teste e ajustar @PreAuthorize conforme roles reais do token.
• 	Documentar variáveis no docker-compose (Keycloak, DB, backends) para ambientes distintos (dev/prod).

Comandos úteis
• 	Ver logs backend:

• 	Testar JWKS dentro do container:

• 	Rebuild geral:


Contatos e repasse
• 	Para quem for continuar: comece pelos três pontos críticos acima (refresh token, issuer/JWKS, CORS NGINX). Depois valide /api/animal/teste e avance para correções de @PreAuthorize e rotas do Angular.