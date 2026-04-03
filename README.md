<p align="center">
  <img src="https://img.shields.io/badge/�_PutraHack_2026-Submission-purple?style=for-the-badge" alt="PutraHack 2026" />
  <img src="https://img.shields.io/badge/�🍛_Nasi_Lemak-Approved-success?style=for-the-badge" alt="Nasi Lemak Approved" />
  <img src="https://img.shields.io/badge/🧅_Bawang_Price-Monitored-blue?style=for-the-badge" alt="Bawang Monitored" />
  <img src="https://img.shields.io/badge/💸_Duit-Saved-orange?style=for-the-badge" alt="Duit Saved" />
</p>

# 🍽️ FoodWise MY

### *Because knowing ayam is RM10.40/kg before you go to pasar = power* 💪

> A Malaysian food price tracker, pantry manager, and budget recipe finder — so you can eat sedap without crying at the cashier.

---

## 🏆 PutraHack 2026

This project was built as a submission for **[PutraHack 2026](https://putrahack.com)** — a hackathon that challenged teams to solve real-world problems through technology.

> *Submission Period: 1st April 2026 – 4th April 2026 (GMT+8)*

FoodWise MY tackles one of the most relatable everyday struggles for Malaysians: **food affordability**. Rising ingredient prices, supply disruptions, and budget cooking — we built a tool that actually helps people navigate all of that, right from their phone.

---

## 🤔 What Is This?

You know that feeling when you walk into the market and bawang merah suddenly costs like gold? **FoodWise MY** is here to save you from that heartbreak.

| Feature | What It Does | Vibe |
| --- | --- | --- |
| 📊 **Price Dashboard** | Track real-time prices of essentials (ayam, telur, beras, minyak...) | "Eh why shallots so expensive?!" |
| 🚨 **Price Alerts** | Get notified when prices spike or drop | Your wallet's bodyguard |
| 🧊 **Pantry Manager** | Track what's in your kitchen | No more buying 3 bottles of soy sauce |
| 🍳 **Recipe Finder** | Budget-friendly recipes based on your pantry | "I have eggs and rice… what can I cook?" |
| 👨‍🍳 **Community Recipes** | Share & discover recipes with ratings and comments | Malaysian MasterChef vibes |
| ⚠️ **Supply Disruptions** | Know when supply chain issues hit your region | Prepper mode: activated |

---

## 🛠️ Tech Stack

```
Frontend    →  React + TypeScript + Vite ⚡
Styling     →  Tailwind CSS + shadcn/ui 🎨
Backend     →  Express.js + PostgreSQL 🐘
Auth        →  Cookie-based sessions (no JWT drama) 🍪
i18n        →  Bahasa Melayu 🇲🇾 + English 🇬🇧
Testing     →  Vitest + Playwright 🧪
Deployment  →  Docker + Nginx 🐳
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** (or just use Docker, we're not animals)
- A love for Malaysian food 🫶

### 1. Clone & Install

```bash
git clone https://github.com/aimanzahar/foodwise-my.git
cd foodwise-my
npm install
```

### 2. Set Up the Database

```bash
# Create the database
npm run db:create

# Run migrations
npm run db:migrate

# Seed with delicious Malaysian data 🍗
npm run db:seed
```

### 3. Fire It Up

```bash
# Start the API server
npm run dev:api

# In another terminal, start the frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start tracking those prices! 📈

### 🐳 Or Just Docker It

```bash
docker compose up --build
```

Boom. Done. Go makan. 🍜

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend dev server |
| `npm run dev:api` | Start backend API server |
| `npm run build` | Build everything for production |
| `npm run db:create` | Create the PostgreSQL database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database with sample data |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests with Playwright |
| `npm run lint` | Lint the codebase |

---

## 🗂️ Project Structure

```
foodwise-my/
├── src/                    # 🎨 React frontend
│   ├── components/         #    UI components (Dashboard, Pantry, Recipes...)
│   ├── hooks/              #    Custom hooks (auth, pantry, bootstrap)
│   ├── pages/              #    Route pages
│   └── lib/                #    Utilities, API client, i18n
├── server/                 # 🖥️ Express backend
│   ├── src/                #    App logic, routes, database
│   ├── scripts/            #    DB setup scripts
│   └── sql/migrations/     #    SQL migration files
├── shared/                 # 🤝 Shared types & seed data
├── e2e/                    # 🧪 Playwright E2E tests
└── deploy/                 # 🐳 Nginx config for Docker
```

---

## 🌐 Bilingual Support

FoodWise MY speaks both **Bahasa Melayu** and **English** — because inclusivity is just as important as knowing the price of telur. 🥚

Toggle languages from the top bar. All food names, recipes, descriptions, and even supply disruption alerts are fully localized.

---

## 🧑‍🍳 Sample Data Includes

- **Ayam Standard** — RM10.40/kg *(up from RM9.26, pain)* 🐔
- **Beras Tempatan** — RM2.60/kg *(steady as always)* 🍚
- **Telur Gred A** — RM0.45/biji *(egg-straordinary prices)* 🥚
- **Minyak Masak** — RM4.20/L *(actually going down, alhamdulillah)* 🫒
- **Bawang Merah** — RM7.80/kg *(why tho)* 🧅

---

## 🤝 Contributing

Found a bug? Got a killer recipe idea? Want to add durian price tracking? 🤢🤤

1. Fork it
2. Create your branch (`git checkout -b feature/durian-tracker`)
3. Commit your changes (`git commit -m 'Add durian price alerts'`)
4. Push to the branch (`git push origin feature/durian-tracker`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Made with ❤️ and sambal 🌶️ in Malaysia</b>
  <br/>
  <i>Save money. Eat well. Track everything.</i>
</p>
