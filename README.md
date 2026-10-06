# YO'L TEST

Haydovchilik guvohnomasi nazariy testlari: o'quvchi paneli + admin paneli + backend (Node.js 18+, kutubxonasiz).

## Ishga tushirish
```
node server.js
```
Birinchi ishga tushganda konsolda **admin login va paroli** chiqadi (`ADMIN_USER` / `ADMIN_PASS` bilan o'zingiz ham berishingiz mumkin). Paroldan keyin admin panelda o'zgartiring. Unutsangiz: `NEW_ADMIN_PASS=yangiparol node server.js`.

## Qanday ishlaydi
1. Admin login bilan kiring, **Yangi o'quvchi** bo'limida login/parol/muddat yarating.
2. Chiqqan xabarni (login, parol, sayt manzili) o'quvchiga yuboring.
3. O'quvchi istalgan telefondan shu manzilga kirib login qiladi. Natijalari serverda saqlanadi, boshqa qurilmada ham ko'rinadi.
4. Muddat tugasa kirish yopiladi; adminda **+30** tugmasi bilan uzaytiriladi.

## Boshqa telefondan kirish
- **Bir Wi-Fi da:** konsoldagi `Tarmoq: http://192.168.x.x:3000` manzilini oching.
- **Internetdan:** Render / Railway / VPS ga joylang (Start: `node server.js`) va doimiy disk (`DATA_DIR`) ulang, aks holda ma'lumotlar o'chib ketadi. Vaqtincha uchun: `cloudflared tunnel --url http://localhost:3000`.
- Internetga ochishda HTTPS ishlating (hosting buni o'zi beradi).

## Prava topshirish (demo)
Pastki menyuda **🚦 Prava** bo'limi: 1-bosqich nazariy imtihon (belgilar testi va aralash test), 2-bosqich **avtodrom simulyatori** (Cobalt/Gentra/Malibu, imtihon yoki mashq rejimi).
- Telefonda: rul (barmoq bilan aylantiring), gaz/tormoz pedallari, R/1/2 uzatma, ◀ ▶ burilish chirog'i. Yotiq holatda qulayroq.
- Kompyuterda: A/D yoki ←/→ rul, W/S yoki ↑/↓ gaz-tormoz, probel tormoz, R/1/2 uzatma, Q/E chiroq, Esc pauza.
- Xatolar: tezlikni oshirish (+5), chiroqsiz burilish (+5), STOP da to'xtamaslik (+10), teskari yurish (+20), yo'ldan chiqish (+100). 100 balldan oshsa yoki 5 daqiqa tugasa imtihondan o'tolmaysiz.
- Barcha natijalar (testlar va avtodrom) o'quvchi hisobida serverda saqlanadi.

## Savollar
Savollar `index.html` ichidagi `Q` massivida: `[bo'lim, savol, [to'g'ri, xato, xato], izoh, belgi]`. Birinchi variant to'g'ri, ko'rsatishda aralashtiriladi.

## GitHub
```
git init
git add .
git commit -m "YO'L TEST: birinchi versiya"
git branch -M main
git remote add origin https://github.com/USERNAME/yol-test.git
git push -u origin main
```
`data/` papkasi `.gitignore` da: o'quvchilar va parollar GitHub ga chiqmaydi.
