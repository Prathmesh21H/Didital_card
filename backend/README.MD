# .ENV

PORT=5000
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# API END POINTS

👤 USER APIs
1️⃣ Create / Update User

POST /api/users
Body

{
"email": "john@example.com",
"profileUrl": "https://cdn.com/profile.jpg",
"fullName": "John Doe",
"designation": "Developer",
"company": "ABC Inc.",
"bio": "Hello, I am John",
"phone": "+911234567890",
"website": "https://john.com",
"linkedin": "https://linkedin.com/in/john",
"twitter": "@john",
"instagram": "@john",
"facebook": "fb.com/john"
}

Response

{
"newUser": true,
"user": { ... }
}

2️⃣ Get User Profile

GET /api/users/me
Response

{
"uid": "uid_abc123",
"email": "john@example.com",
"fullName": "John Doe",
...
}

📦 SUBSCRIPTION APIs
3️⃣ Select Plan

POST /api/subscription/select
Body

{
"plan": "FREE" // FREE | PRO | PREMIUM
}

Response

{
"requiresPayment": false
}

4️⃣ Confirm Payment (DEMO)

POST /api/subscription/confirm-payment
Body

{
"plan": "PRO",
"paymentGateway": "demo",
"paymentId": "demo_txn_001"
}

Response

{
"paymentConfirmed": true,
"demoMode": true
}

5️⃣ Downgrade Plan

POST /api/subscription/downgrade
Response

{
"downgraded": true
}

6️⃣ Get Subscription

GET /api/subscription
Response

{
"uid": "uid_abc123",
"plan": "FREE",
"cardLimit": 1,
"cardsCreated": 0,
"status": "active"
}

💳 DIGITAL CARD APIs
7️⃣ Create Digital Card

POST /api/cards
Body

{
"profileUrl": "https://cdn.com/profile.jpg",
"banner": { "type": "color", "value": "#ff0000" },
"fontStyle": "basic",
"cardSkin": null,
"layout": "minimal",
"fullName": "John Doe",
"designation": "Developer",
"company": "ABC Inc.",
"bio": "Hello, I am John",
"phone": "+911234567890",
"email": "john@example.com",
"website": "https://john.com",
"linkedin": "https://linkedin.com/in/john",
"twitter": "@john",
"instagram": "@john",
"facebook": "fb.com/john"
}

Response

{
"cardId": "card_abc123",
"cardLink": "card/card_abc123"
}

8️⃣ Fetch My Cards

GET /api/cards/me
Response

[
{
"cardId": "card_abc123",
"ownerUid": "uid_abc123",
"fullName": "John Doe",
"cardLink": "card/card_abc123",
...
}
]

9️⃣ Update Digital Card

PUT /api/cards/:cardId
Body

{
"bio": "Updated bio",
"layout": "minimal"
}

Response

{
"updated": true
}

10️⃣ Delete Digital Card

DELETE /api/cards/:cardId
Response

{
"deleted": true
}

🕵️ RECENTLY SCANNED CARDS
12️⃣ Save Scanned Card

POST /api/recently-scanned
Body

{
"cardLink": "card/card_abc123"
}

Response (registered user)

{
"saved": true,
"scannedCards": [
{ "cardLink": "card/card_abc123", "scannedAt": "2025-12-27T06:30:00Z" }
]
}

Response (non-registered user)

{
"saved": false,
"message": "Sign up to save this card"
}

13️⃣ Get Recently Scanned Cards

GET /api/recently-scanned/me

Query parameter optional:

?cardLink=card/card_abc123

Response

Registered user: Returns their saved scanned cards

Non-registered user + cardLink: Returns the card info, prompt to sign up

Non-registered user no cardLink: Empty array + signup prompt

Example Response (non-registered with cardLink)
{
"card": {
"cardId": "card_abc123",
"ownerUid": "uid_abc123",
"fullName": "John Doe",
"profileUrl": "https://cdn.com/profile.jpg",
"banner": { "type": "color", "value": "#ff0000" },
"fontStyle": "basic",
"layout": "minimal",
"cardLink": "card/card_abc123"
},
"message": "Sign up to save this card"
}

11️⃣ Public Fetch by Card Link

GET /api/cards/public/:cardLink
Example:

GET /api/cards/public/card/abc123

Response

{
"card": {
"cardId": "card_abc123",
"ownerUid": "uid_abc123",
"fullName": "John Doe",
"profileUrl": "https://cdn.com/profile.jpg",
"banner": { "type": "color", "value": "#ff0000" },
"fontStyle": "basic",
"layout": "minimal",
"cardLink": "card/card_abc123"
},
"message": "Sign up to save this card"
}
