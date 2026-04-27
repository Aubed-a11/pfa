package com.pfa.backend.payment.dto;

import com.pfa.backend.payment.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "L'ID de la commande est requis")
    private Long orderId;

    @NotNull(message = "La méthode de paiement est requise")
    private PaymentMethod method;
}
