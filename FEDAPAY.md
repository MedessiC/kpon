# Intégration FedaPay

Guide pour intégrer FedaPay (Mobile Money) aux paiements KPON.

## 📋 Prérequis

- Compte FedaPay [fedapay.com](https://fedapay.com)
- Pays supportés : Bénin, Burkina Faso, Côte d'Ivoire...

## 🔑 Setup Initial

### 1. Créer un compte FedaPay

1. Aller à [fedapay.com](https://fedapay.com)
2. S'enregistrer
3. Vérifier l'email
4. Configurer le business profile

### 2. Récupérer les clés API

Dashboard → Settings → API Keys

```
VITE_FEDAPAY_PUBLIC_KEY=pk_live_xxxxx...
VITE_FEDAPAY_ENVIRONMENT=production
```

Pour tester en development :

```
VITE_FEDAPAY_PUBLIC_KEY=pk_test_xxxxx...
VITE_FEDAPAY_ENVIRONMENT=test
```

### 3. Ajouter au `.env`

```env
VITE_FEDAPAY_PUBLIC_KEY=pk_test_xxxxx
VITE_FEDAPAY_ENVIRONMENT=test
```

## 💸 Flows de Paiement

### Flow Standard

```
1. Client remplit le formulaire
   ↓
2. Créer une transaction
   ↓
3. Rediriger vers FedaPay
   ↓
4. Client rentre le code reçu par SMS
   ↓
5. Confirmer le paiement
   ↓
6. Webhook reçu
   ↓
7. Fichier débloqué
```

### 1. Créer une transaction

```typescript
// src/lib/services/fedapay.service.ts
import axios from "axios";

const FEDAPAY_API = "https://api.fedapay.com/v1";

export async function createTransaction(
  phoneNumber: string,
  amount: number,
  projectId: string
) {
  const response = await axios.post(`${FEDAPAY_API}/transactions`, {
    description: `Télécharger le projet ${projectId}`,
    amount,
    currency: "XOF",
    customer: {
      phone_number: phoneNumber,
    },
    metadata: {
      projectId,
    },
  }, {
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_FEDAPAY_API_SECRET}`,
    },
  });

  return response.data.transaction;
}
```

### 2. Obtenir le lien de paiement

```typescript
export function getPaymentLink(transaction: any): string {
  // FedaPay retourne automatiquement un lien de redirection
  return transaction.public_link;
}
```

### 3. Vérifier le statut du paiement

```typescript
export async function checkPaymentStatus(transactionId: string) {
  const response = await axios.get(
    `${FEDAPAY_API}/transactions/${transactionId}`,
    {
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_FEDAPAY_API_SECRET}`,
      },
    }
  );

  return response.data.transaction.status; // "approved", "pending", "declined"
}
```

## 🔄 Webhooks

### Configurer les webhooks

Dashboard → Settings → Webhooks

```
URL: https://kpon.api.com/webhooks/fedapay
Events:
  - transaction.approved
  - transaction.declined
```

### Handler de webhook

```typescript
// Backend: src/routes/webhooks.ts
import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post("/fedapay", (req, res) => {
  // Vérifier la signature
  const signature = req.headers["x-fedapay-signature"];
  const payload = JSON.stringify(req.body);
  const secret = process.env.FEDAPAY_SECRET;
  
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Traiter le webhook
  const { transaction } = req.body;

  if (transaction.status === "approved") {
    // Débloquer le fichier pour le client
    unlockProjectDownload(transaction.metadata.projectId, transaction.customer.phone_number);
  } else if (transaction.status === "declined") {
    // Informer le client d'une erreur
    notifyPaymentFailed(transaction.customer.phone_number);
  }

  res.json({ success: true });
});

export default router;
```

## 💻 Implémentation Frontend

### Hook de paiement

```typescript
// src/hooks/usePayment.ts
export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (data: PaymentFormData) => {
      // 1. Créer la transaction
      const transaction = await paymentService.initiatePayment(data);
      
      // 2. Stocker dans localStorage pour tracking
      sessionStorage.setItem("fedapayTransaction", transaction.id);
      
      // 3. Rediriger vers FedaPay
      window.location.href = transaction.redirectUrl;
    },
  });
}
```

### Component de paiement

```typescript
// src/pages/ClientPreview.tsx
function PaymentForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { mutate: pay, isPending } = useInitiatePayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pay({
      projectId: projectId,
      amount: project.price,
      phoneNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+22312345678"
        required
      />
      <button disabled={isPending}>
        {isPending ? "Chargement..." : "Payer"}
      </button>
    </form>
  );
}
```

## 🧪 Testing

### Numéros de test

```
Pays     | Numéro       | Résultat
---------|--------------|----------
Bénin    | +22990000001 | ✅ Approbation
Bénin    | +22990000002 | ❌ Rejet
Burkina  | +22612345678 | ✅ Approbation
```

### Test d'intégration

```typescript
import { describe, it, expect, vi } from "vitest";

describe("FedaPay Integration", () => {
  it("should create a transaction", async () => {
    const transaction = await createTransaction(
      "+22312345678",
      50000,
      "proj123"
    );
    expect(transaction.id).toBeDefined();
    expect(transaction.amount).toBe(50000);
  });

  it("should verify payment webhook signature", () => {
    const signature = crypto
      .createHmac("sha256", SECRET)
      .update(JSON.stringify(WEBHOOK_PAYLOAD))
      .digest("hex");

    expect(verifyWebhookSignature(signature)).toBe(true);
  });
});
```

## 🔐 Sécurité

### Bonnes pratiques

1. **Clés API côté serveur uniquement**
   ```
   ❌ Ne pas exposer FEDAPAY_API_SECRET au frontend
   ✅ Utiliser un backend proxy
   ```

2. **Valider les signatures de webhooks**
   ```typescript
   if (!verifyWebhookSignature(req.headers["x-fedapay-signature"])) {
     throw new Error("Invalid signature");
   }
   ```

3. **Utiliser HTTPS en production**
   ```
   https://kpon.com/pay (requis par FedaPay)
   ```

4. **Rate limit les tentatives de paiement**
   ```typescript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 tentatives max
   });
   ```

## 🚀 Production

### Checklist de déploiement

- [ ] Passer du mode test au mode production
- [ ] Mettre à jour les clés API
- [ ] Configurer les URLs de webhook
- [ ] Tester avec des vrais paiements (montant mineur)
- [ ] Configurer les emails de notification
- [ ] Activer le logging/monitoring
- [ ] Tester les scénarios d'erreur

### Variables d'environnement production

```env
FEDAPAY_PUBLIC_KEY=pk_live_xxxxx...
FEDAPAY_SECRET_KEY=sk_live_xxxxx...
FEDAPAY_WEBHOOK_SECRET=ws_live_xxxxx...
FEDAPAY_ENVIRONMENT=production
```

## 📊 Monitoring

### Suivi des paiements

```typescript
export function getPaymentStats() {
  return axios.get(`${FEDAPAY_API}/analytics`, {
    headers: { "Authorization": `Bearer ${API_SECRET}` },
  });
}
```

## 🐛 Troubleshooting

### "Request failed with status 401"

Vérifier les clés API dans l'environnement

### "Phone number not valid"

Vérifier le format : `+[country_code][number]`

### "Webhook not received"

1. Vérifier l'URL du webhook
2. Vérifier les logs FedaPay
3. Tester manuellement avec Postman

## 📞 Support

- [FedaPay Documentation](https://docs.fedapay.com)
- [API Reference](https://fedapay.com/api)
- Email support: support@fedapay.com

---

**Note**: KPON ne touche pas au paiement directement. Les fonds vont d'abord à FedaPay, puis sont transférés selon votre configuration.
