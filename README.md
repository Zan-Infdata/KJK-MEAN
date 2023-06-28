# Spletno programiranje 2022/2023

Lastni projekt pri predmetu **Spletno programiranje** v študijskem letu **2022/2023**.

## Kratek opis aplikacije

Aplikacija, ki je nastala v okviru lastnega projekta, je inspirirana po potrebi za vodenje evidence opreme, ki je v lasti skavtskega stega Ljubljana 2.<br />
Zasnova projekta oz. podatkovne strukture temelji na dveh modelih: **lokacije** in **oprema**.<br />
Poleg tega pa je implementirana tudi avtentikacija, ki poskrbi, da do podatkov o opremi lahko pridejo le prijavljeni uporabniki ter skrbijo za sled izposoje dotične opreme.

## Namestitev aplikacije
### Javni dostop
Aplikacijo trenutno poganja okolje Fly.io in je na voljo na povezavi [https://skladisce-lj2.onrender.com](https://skladisce-lj2.onrender.com).

### Lokalno poganjanje
V datoteki `.env` nastavimo okoljske spremenljivke `NODE_ENV`, `MONGO_ATLAS_URI` in `JWT_SECRET`
Lokalno poženemo z ukazi
1. `npm install`
3. `cd app`
3. `ng serve`

## Uporaba aplikacije
Obiščemo spletno aplikacijo na naslovu [localhost:4200](http://localhost:4200) ali [https://skladisce-lj2.onrender.com](https://skladisce-lj2.onrender.com). Za nadaljevanje moramo biti prijavljeni.
Ko smo prijavljeni, dobimo možnost pregleda/dodajanja/spreminjanja lokacij in opreme. Za navigacijo med navedenimi akcijami uporabimo zgornjo vrstico.<br />
Za izposojo opreme uporabimo 'Vzemi opremo'. Najprej izberemo skladišče, iz katerega jemljemo opremo, nato lokacijo, na katero opremo nesemo (če še ni ustvarjena, jo ustvarimo), in z uporabo gumba '+' v desno tabelo dodamo opremo, ki si jo bomo izposodili.<br />
Ko opremo poklikamo, pritisnemo gumb 'Vzemi opremo' in se nam odpre stran 'Moja oprema', ki pokaže na katerih lokacijah imamo katero opremo.
