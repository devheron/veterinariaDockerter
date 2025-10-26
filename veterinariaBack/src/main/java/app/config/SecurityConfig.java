package app.config;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

      // Autorização: protege a API, libera OPTIONS e estáticos
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/", "/index.html", "/assets/**").permitAll()
        .requestMatchers("/api/**").authenticated()
        .anyRequest().permitAll()
      )

      // Desliga login form/basic (usaremos Bearer JWT)
      .formLogin(form -> form.disable())
      .httpBasic(basic -> basic.disable())

      // (opcional) se algo tentar autenticar, devolve 401 em vez de redirecionar p/ /login
      .exceptionHandling(ex -> ex.authenticationEntryPoint(
        (req, res, e) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED)
      ));

  // Habilita validação de JWT (JWKS configurado via properties/env)
  http.oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));

    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
      "http://localhost:4200",
      "https://system1.net",
      "https://system2.net"
    ));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin",
                                     "X-Requested-With","Access-Control-Request-Method",
                                     "Access-Control-Request-Headers"));
    config.setExposedHeaders(List.of("Location","Authorization"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
