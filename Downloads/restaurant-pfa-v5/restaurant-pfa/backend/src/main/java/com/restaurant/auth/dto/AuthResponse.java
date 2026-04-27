package com.pfa.backend.auth.dto;

import com.pfa.backend.user.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
