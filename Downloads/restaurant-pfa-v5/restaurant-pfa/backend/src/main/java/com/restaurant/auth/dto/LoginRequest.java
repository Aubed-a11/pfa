package com.pfa.backend.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}
