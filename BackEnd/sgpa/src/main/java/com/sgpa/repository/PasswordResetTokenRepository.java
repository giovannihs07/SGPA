package com.sgpa.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sgpa.model.auth.PasswordResetToken;
import com.sgpa.model.users.User;

// Repositorio para el token de reseteo de contraseña
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Encuentra un token de reseteo que no ha sido usado
    Optional<PasswordResetToken> findByTokenHashAndUsedAtIsNull(String tokenHash);

    Optional<PasswordResetToken> findByTokenHashAndUser_EmailAndUsedAtIsNull(
            String tokenHash, String email);

    // Cuenta el número de tokens de reseteo recientes para un usuario
    @Query("""
            SELECT COUNT(t) FROM PasswordResetToken t
            WHERE t.user.email = :email AND t.createdAt >= :since
            """)
    long countRecentByUserEmail(@Param("email") String email, @Param("since") LocalDateTime since);

    // Invalida todos los tokens de reseteo activos para un usuario
    @Modifying
    @Query("""
            UPDATE PasswordResetToken t SET t.usedAt = :now
            WHERE t.user = :user AND t.usedAt IS NULL
            """)
    void invalidateActiveTokensForUser(@Param("user") User user, @Param("now") LocalDateTime now);
}
