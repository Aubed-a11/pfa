package com.restaurant.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.restaurant.modules.menu.entity.Category;
import com.restaurant.modules.menu.entity.Dish;
import com.restaurant.modules.menu.repository.CategoryRepository;
import com.restaurant.modules.menu.repository.DishRepository;
import com.restaurant.user.entity.User;
import com.restaurant.user.enums.Role;
import com.restaurant.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final DishRepository dishRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Données déjà initialisées, skip.");
            return;
        }

        log.info("Initialisation des données de démonstration...");

        User admin = userRepository.save(User.builder()
                .name("Admin Restaurant")
                .email("admin@restaurant.ma")
                .password(passwordEncoder.encode("admin123"))
                .phone("0600000001")
                .role(Role.ADMIN)
                .active(true)
                .build());

        User staff = userRepository.save(User.builder()
                .name("Chef Cuisine")
                .email("chef@restaurant.ma")
                .password(passwordEncoder.encode("chef123"))
                .phone("0600000002")
                .role(Role.STAFF)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .name("Client Test")
                .email("client@restaurant.ma")
                .password(passwordEncoder.encode("client123"))
                .phone("0600000003")
                .role(Role.CLIENT)
                .active(true)
                .build());

        // ── Catégories ────────────────────────────────────────
        Category entrees = categoryRepository.save(Category.builder()
                .name("Entrées").description("Soupes, salades et entrées chaudes")
                .displayOrder(1).active(true).build());

        Category plats = categoryRepository.save(Category.builder()
                .name("Plats principaux").description("Tajines, grillades et spécialités")
                .displayOrder(2).active(true).build());

        Category desserts = categoryRepository.save(Category.builder()
                .name("Desserts").description("Pâtisseries orientales et entremets")
                .displayOrder(3).active(true).build());

        Category boissons = categoryRepository.save(Category.builder()
                .name("Boissons").description("Thé, jus et boissons fraîches")
                .displayOrder(4).active(true).build());

        // ── Plats ─────────────────────────────────────────────
        dishRepository.save(Dish.builder().name("Harira").category(entrees)
                .description("Soupe traditionnelle marocaine aux légumes et épices")
                .price(new BigDecimal("25.00")).available(true).featured(false).prepTimeMinutes(15).build());

        dishRepository.save(Dish.builder().name("Briouates au fromage").category(entrees)
                .description("Feuilletés croustillants au fromage frais et herbes")
                .price(new BigDecimal("45.00")).available(true).featured(true).prepTimeMinutes(10).build());

        dishRepository.save(Dish.builder().name("Salade marocaine").category(entrees)
                .description("Tomates, concombres, poivrons, coriandre et citron")
                .price(new BigDecimal("35.00")).available(true).featured(false).prepTimeMinutes(5).build());

        dishRepository.save(Dish.builder().name("Tajine poulet aux olives").category(plats)
                .description("Tajine traditionnel avec poulet fermier, olives et citrons confits")
                .price(new BigDecimal("95.00")).available(true).featured(true).prepTimeMinutes(40).build());

        dishRepository.save(Dish.builder().name("Couscous royal").category(plats)
                .description("Couscous aux 7 légumes avec agneau, poulet et merguez")
                .price(new BigDecimal("120.00")).available(true).featured(true).prepTimeMinutes(50).build());

        dishRepository.save(Dish.builder().name("Grillades mixtes").category(plats)
                .description("Brochettes de viande, merguez et kefta grillées au charbon")
                .price(new BigDecimal("110.00")).available(true).featured(false).prepTimeMinutes(25).build());

        dishRepository.save(Dish.builder().name("Pastilla au poulet").category(plats)
                .description("Feuilleté sucré-salé garni de poulet, amandes et cannelle")
                .price(new BigDecimal("85.00")).available(true).featured(true).prepTimeMinutes(30).build());

        dishRepository.save(Dish.builder().name("Chebakia").category(desserts)
                .description("Gâteau au miel et sésame, parfumé à la rose")
                .price(new BigDecimal("30.00")).available(true).featured(false).prepTimeMinutes(5).build());

        dishRepository.save(Dish.builder().name("Cornes de gazelle").category(desserts)
                .description("Pâtisserie aux amandes et fleur d'oranger")
                .price(new BigDecimal("35.00")).available(true).featured(true).prepTimeMinutes(5).build());

        dishRepository.save(Dish.builder().name("Thé à la menthe").category(boissons)
                .description("Thé vert Gunpowder à la menthe fraîche et sucre")
                .price(new BigDecimal("15.00")).available(true).featured(true).prepTimeMinutes(5).build());

        dishRepository.save(Dish.builder().name("Jus d'avocat").category(boissons)
                .description("Jus d'avocat frais au lait et miel")
                .price(new BigDecimal("30.00")).available(true).featured(false).prepTimeMinutes(5).build());

        dishRepository.save(Dish.builder().name("Eau minérale").category(boissons)
                .description("50cl ou 1L").price(new BigDecimal("10.00"))
                .available(true).featured(false).prepTimeMinutes(1).build());

        log.info("✅ Données de démonstration créées !");
        log.info("   Admin   : admin@restaurant.ma / admin123");
        log.info("   Staff   : chef@restaurant.ma  / chef123");
        log.info("   Client  : client@restaurant.ma / client123");
    }
}
