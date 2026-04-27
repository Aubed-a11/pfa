package com.pfa.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @NotBlank(message = "Le prénom est requis")
    private String firstName;

    @NotBlank(message = "Le nom est requis")
    private String lastName;
}
