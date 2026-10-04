let tabla = ["", "", "", "", "", "", "", "", ""];

let aktualisJatekos = "X";

let vegeAJatek = false;

let jatekMod = "ketjatekos";

let varAGepre = false;

let gepIdozito = null;

let xPontok = 0;
let oPontok = 0;

const nyeroKombinaciok = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const mezok = document.querySelectorAll(".mezo");
const allapotSzoveg = document.getElementById("allapot");
const ujrainditasGomb = document.getElementById("ujrainditasGomb");

const egyjatekosGomb = document.getElementById("egyjatekosGomb");
const ketjatekosGomb = document.getElementById("ketjatekosGomb");

const xNevMezo = document.getElementById("xNev");
const oNevMezo = document.getElementById("oNev");
const xPontSzoveg = document.getElementById("xPont");
const oPontSzoveg = document.getElementById("oPont");
const xKartya = document.getElementById("xKartya");
const oKartya = document.getElementById("oKartya");

function aktualisNev() 
{
  let nev;

  if (aktualisJatekos === "X") 
  {
    nev = xNevMezo.value.trim();
    if (nev === "") 
    {
      nev = "X játékos";
    }
  } 
  else 
  {
    nev = oNevMezo.value.trim();
    if (nev === "") 
    {
      nev = "O játékos";
    }
  }
  return nev;
}

function kovetkezoKiirasa() 
{
  allapotSzoveg.textContent = aktualisNev() + " köre jön (" + aktualisJatekos + ")";
  jatekosKiemeles();
}

function jatekosKiemeles() 
{
  xKartya.classList.remove("soron-van", "gyoztes");
  oKartya.classList.remove("soron-van", "gyoztes");

  if (vegeAJatek === false) 
  {
    if (aktualisJatekos === "X") 
    {
      xKartya.classList.add("soron-van");
    } 
    else 
    {
      oKartya.classList.add("soron-van");
    }
  }
}

function mezoraKattintas() 
{
  if (varAGepre === true) 
  {
    return;
  }

  let sorszam = Number(this.dataset.sorszam);
  lepes(sorszam);
}

function lepes(sorszam) 
{
  // Ha a mező már foglalt, vagy vége a játéknak, nem csinálunk semmit
  if (tabla[sorszam] !== "" || vegeAJatek === true) 
  {
    return;
  }

tabla[sorszam] = aktualisJatekos;
mezok[sorszam].textContent = aktualisJatekos;
mezok[sorszam].classList.add(aktualisJatekos.toLowerCase());
mezok[sorszam].disabled = true;

let nyeroSor = keresNyeroSort();

if (nyeroSor !== null) 
{
  nyertValaki(nyeroSor);
} 
else if (tablaTeleVan()) 
{
  dontetlenLett();
} 
else 
{
  jatekosValtas();

  if (jatekMod === "egyjatekos" && aktualisJatekos === "O") 
  {
    gepIndit();
  }
  }
}

// Végignézi a 8 kombinációt. Ha valamelyik mind a 3 mezője ugyanaz (és nem üres), visszaadja azt a kombinációt. Ha nincs nyertes, null-t ad vissza.
function keresNyeroSort() 
{
  for (let i = 0; i < nyeroKombinaciok.length; i++) 
  {
    let kombinacio = nyeroKombinaciok[i];
    let elso = kombinacio[0];
    let masodik = kombinacio[1];
    let harmadik = kombinacio[2];

    if(tabla[elso] !== "" && tabla[elso] === tabla[masodik] && tabla[elso] === tabla[harmadik]) 
    {
      return kombinacio;
    }
  }
  return null;
}

function tablaTeleVan() 
{
  for (let i = 0; i < tabla.length; i++) 
  {
    if (tabla[i] === "") 
    {
      return false;
    }
  }
  return true;
}


function jatekosValtas() 
{
  if (aktualisJatekos === "X") 
  {
    aktualisJatekos = "O";
  } 
  else 
  {
    aktualisJatekos = "X";
  }
  kovetkezoKiirasa();
}

function nyertValaki(nyeroSor) 
{
  vegeAJatek = true;
  allapotSzoveg.textContent = aktualisNev() + " nyert! 🎉";

  for (let i = 0; i < nyeroSor.length; i++) 
  {
    mezok[nyeroSor[i]].classList.add("nyero");
  }


  if (aktualisJatekos === "X") 
  {
    xPontok = xPontok + 1;
  } 
  else 
  {
    oPontok = oPontok + 1;
  }
  pontokFrissitese();

  jatekosKiemeles();
  if (aktualisJatekos === "X") 
  {
    xKartya.classList.add("gyoztes");
  } 
  else 
  {
    oKartya.classList.add("gyoztes");
  }

  mezokLetiltasa();
}

function dontetlenLett() 
{
  vegeAJatek = true;
  allapotSzoveg.textContent = "Döntetlen!";
  jatekosKiemeles();
}

function mezokLetiltasa() 
{
  for (let i = 0; i < mezok.length; i++) 
  {
    mezok[i].disabled = true;
  }
}

function pontokFrissitese() 
{
  xPontSzoveg.textContent = xPontok;
  oPontSzoveg.textContent = oPontok;
}

function gepIndit() 
{
  varAGepre = true;
  gepIdozito = setTimeout(gepLep, 500);
}

function gepLep() 
{
  varAGepre = false;

//Ha tud nyerni (két O van egy sorban), nyerjen
let valasztott = keresKettot("O");

//Ha nem, akkor megakadályozza, hogy az X nyerjen
if(valasztott === -1) 
{
  valasztott = keresKettot("X");
}

//Ha nincs ilyen, a középső mezőt választja (ha üres)
if(valasztott === -1 && tabla[4] === "") 
{
  valasztott = 4;
}
//Egyébként egy véletlenszerű üres mezőt
if(valasztott === -1) 
{
  valasztott = veletlenUresMezo();
}
  lepes(valasztott);
}

//Megkeresi azt a kombinációt, ahol a megadott jelből (pl. "O") már 2 van, a harmadik mező pedig üres. Visszaadja az üres mező sorszámát, vagy -1-et.
function keresKettot(jel) 
{
  for (let i = 0; i < nyeroKombinaciok.length; i++) 
  {
    let kombinacio = nyeroKombinaciok[i];
    let jelekSzama = 0;
    let uresMezo = -1;

    for (let j = 0; j < kombinacio.length; j++) 
    {
      let sorszam = kombinacio[j];
      if (tabla[sorszam] === jel) 
      {
        jelekSzama = jelekSzama + 1;
      } 
      else if (tabla[sorszam] === "") 
      {
        uresMezo = sorszam;
      }
    }

    if (jelekSzama === 2 && uresMezo !== -1) 
    {
      return uresMezo;
    }
  }
  return -1;
}

function veletlenUresMezo() 
{
  let uresek = [];
  for (let i = 0; i < tabla.length; i++) 
  {
    if (tabla[i] === "") 
    {
      uresek.push(i);
    }
  }
  let veletlenSzam = Math.floor(Math.random() * uresek.length);
  return uresek[veletlenSzam];
}

function ujrainditas() 
{
  clearTimeout(gepIdozito);
  varAGepre = false;

  tabla = ["", "", "", "", "", "", "", "", ""];
  aktualisJatekos = "X";
  vegeAJatek = false;
  kovetkezoKiirasa();

  for (let i = 0; i < mezok.length; i++) 
  {
    mezok[i].textContent = "";
    mezok[i].disabled = false;
    mezok[i].className = "mezo"; //leveszi az x, o, nyero osztályokat
  }
}

function modValtas(ujMod) 
{
  jatekMod = ujMod;

  if (ujMod === "egyjatekos") 
  {
    // Gép ellen: az O játékos a számítógép
    oNevMezo.value = "Számítógép";
    oNevMezo.disabled = true;
    egyjatekosGomb.classList.add("aktiv");
    ketjatekosGomb.classList.remove("aktiv");
  } 
  else 
  {
    //Két ember: az O játékos neve újra írható
    oNevMezo.value = "2. játékos";
    oNevMezo.disabled = false;
    ketjatekosGomb.classList.add("aktiv");
    egyjatekosGomb.classList.remove("aktiv");
  }

  xPontok = 0;
  oPontok = 0;
  pontokFrissitese();
  ujrainditas();
}

//Ha valaki átírja a nevét játék közben, a felirat is frissüljön
function nevValtozott() 
{
  if (vegeAJatek === false) 
  {
    kovetkezoKiirasa();
  }
}

for (let i = 0; i < mezok.length; i++) 
{
  mezok[i].addEventListener("click", mezoraKattintas);
}

ujrainditasGomb.addEventListener("click", ujrainditas);
xNevMezo.addEventListener("input", nevValtozott);
oNevMezo.addEventListener("input", nevValtozott);

egyjatekosGomb.addEventListener("click", function () 
{
  modValtas("egyjatekos");
});
ketjatekosGomb.addEventListener("click", function () 
{
  modValtas("ketjatekos");
});

kovetkezoKiirasa();