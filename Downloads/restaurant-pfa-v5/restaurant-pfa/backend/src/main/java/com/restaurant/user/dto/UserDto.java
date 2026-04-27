package com.pfa.backend.user.dto;

import com.pfa.backend.user.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
