//package app.config;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
///**
// * Converte roles do Keycloak (realm_access e resource_access) para ROLE_*
// * que o Spring entende em hasRole/hasAnyRole.
// */
//public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
//
//    @Override
//    public Collection<GrantedAuthority> convert(Jwt jwt) {
//        Set<String> roles = new HashSet<>();
//
//        // Roles do realm: realm_access.roles
//        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
//        if (realmAccess != null) {
//            Object raw = realmAccess.get("roles");
//            if (raw instanceof Collection<?> col) {
//                for (Object r : col) {
//                    roles.add("ROLE_" + r.toString().toUpperCase());
//                }
//            }
//        }
//
//        // Roles de clients: resource_access.<client>.roles
//        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
//        if (resourceAccess != null) {
//            for (Map.Entry<String, Object> entry : resourceAccess.entrySet()) {
//                Object data = entry.getValue();
//                if (data instanceof Map<?, ?> m) {
//                    Object raw = m.get("roles");
//                    if (raw instanceof Collection<?> col) {
//                        for (Object r : col) {
//                            roles.add("ROLE_" + r.toString().toUpperCase());
//                        }
//                    }
//                }
//            }
//        }
//
//        return roles.stream()
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toSet());
//    }
//}
