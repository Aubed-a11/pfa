package com.restaurant.modules.auth.service;

import com.restaurant.modules.auth.dto.AuthDto;
import com.restaurant.modules.auth.security.JwtProvider;
import com.restaurant.user.entity.User;
import com.restaurant.user.enums.Role;
import com.restaurant.user.repository.UserRepository;
import com.restaurant.shared.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("Utilisateur non trouve"));
        String token = jwtProvider.generateToken(user.getEmail());
        return AuthDto.AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .user(AuthDto.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build())
            .build();
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email deja utilise");
        }
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.CLIENT)
            .build();
        userRepository.save(user);
        String token = jwtProvider.generateToken(user.getEmail());
        return AuthDto.AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .user(AuthDto.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build())
            .build();
    }
}