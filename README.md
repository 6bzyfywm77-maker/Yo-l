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

## Belgilar bazasi va chorrahalar
`L` massivi: `[id, guruh, nom, svg]`: 139 ta belgi, 7 guruh (ogohlantiruvchi, imtiyozli, taqiqlovchi, buyuruvchi, axborot, servis, qo'shimcha). Har bir belgi uchun "Bu belgi nimani bildiradi?" savoli avtomatik yaratiladi. Yangi belgi qo'shish uchun `L` ga qator qo'shing.
`SC` massivi: `[[[yo'l, harakat, rang, belgi?]...], g'olib rang, izoh]`. Yo'l 0..3 (pastdan soat strelkasi bo'yicha), harakat `s` to'g'ri, `l` chapga, `r` o'ngga; belgi: `main`, `yield`, `stop`, `lampg`, `lampr`.

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
