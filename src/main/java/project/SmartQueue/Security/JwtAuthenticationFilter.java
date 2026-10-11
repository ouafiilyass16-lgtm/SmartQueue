package project.SmartQueue.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Récupérer le header Authorization
        String authHeader =
                request.getHeader("Authorization");

        // Si le header n'existe pas
        // ou ne commence pas par Bearer
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Retirer "Bearer "
        String token =
                authHeader.substring(7);

        try {

            // Récupérer l'email du JWT
            String email =
                    jwtService.extractUsername(token);

            // Vérifier qu'aucun utilisateur
            // n'est déjà authentifié
            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Chercher l'utilisateur en base
                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

                // Vérifier le JWT
                if (jwtService.isTokenValid(token)) {

                    // Créer l'authentification
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Ajouter les détails de la requête
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Informer Spring que l'utilisateur
                    // est authentifié
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            // Token invalide
            // On laisse Spring Security gérer la requête
        }

        // Continuer la chaîne des filtres
        filterChain.doFilter(request, response);
    }
}