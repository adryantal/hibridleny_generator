$(function () {
  const allat = [];
  const tanulo = [];
  const osszerendelTomb = [];

  //Feladat menete:

  //1. tanulo tomb feltoltese
  //2. allat tomb feltoltese
  //3. osszerendel meghivasa

  //adatok betoltese Ajax hivassal

  //a tanulok beolvasasa a legordulo menu megfelelo elemenek kivalasztasara tortenjen meg
  $("#osztaly").on("change", () => {
    tanulo.splice(0, tanulo.length); //kiuritjuk a tanulo tombot; letrehoz egy uj tombot is, miutan kivette az ertekeket!
    allat.splice(0, allat.length); //kiuritjuk az allat tombot;

    let fajlnev = $("#osztaly").val() + ".json"; //a legördülő listából kiválasztott elem value-jából - pl. nGRA1.json - képzett json filenév
    console.log(fajlnev);
    adatbeolvas(fajlnev, tanulo, allatokBelovasas); //az allatok beolvasasa a tanulok beolvasasa utan tortenjen --> myCallback
  });

  function allatokBelovasas() {
    adatbeolvas("adatok.json", allat, osszeRendel); //az osszeRendel meghivasa az allatok beolvasasa utan tortenjen --> myCallback
  }



  /*Adatok megjelenitese div-ekben*/
  function megjelenit(tomb) {
    $("article").empty();  //article ürítése
    //vegigmegyunk a tombon, es minden tombelemet beteszunk egy div-be
    let txt = "";
    tomb.forEach((element) => {   //element: tomb akt. eleme
      txt += "<div>" + element.nev + "</div>"; //a tomb (osszerendel tomb) akt. objektumanak "nev" kulcsanak erteke
      element.haromAllat.forEach((allat) => {  //a tomb (osszerendel tomb) akt haromAllat tombjenek mind3 elemet kulon div-be tesszuk
        txt += "<div>" + allat + "</div>";
      });
    });
    console.log(txt);
    //ha a txt-vel osszeallt a html kod, ezt adjuk az article elemhez
    $("article").append(txt);
  }

  //a tanulokhoz generalunk 3 allatot, veletlenszeruen

  function osszeRendel() {
    osszerendelTomb.splice(0, osszerendelTomb.length); //osszerendelTomb uritese
   
    //vegig kell menni a tanulo tombon, es 3 allatot kell hozzarendelni
    tanulo.forEach(function (element) {
      let obj = {};
      obj.nev = element;
      const haromAllat = []; //a hatokor csak blokkon belul erv.
      let index=0;
      while (haromAllat.length<3) { //addig csinálja, amíg a tömb elemszáma el nem éri a 3-at
        //kell egy random index (0-allat tomb hosszaig), ezen indexu allat-elemeket rendeljuk a tanulohoz
        let velIndex = Math.floor(Math.random() * allat.length); // [0,(allat.length-1)]        
        haromAllat.push(allat[velIndex]); //belepakoljuk a haromAllat tombbe a 3 allatnevet
        //kulonbozoseg:
        if(haromAllat[haromAllat.length-1]===haromAllat[haromAllat.length-2]){ //ha az utolsó két elem megegyezik, csípje le az utolsót
          haromAllat.pop();
        }
      }
      obj.haromAllat = haromAllat;
      osszerendelTomb.push(obj);
    });
    //console.log(osszerendelTomb);    
    megjelenit(osszerendelTomb);
  }

  function adatbeolvas(fajlnev, tomb, myCallback) {
    //--> myCallback egy muveletre (fuggvenyre) torteno hivatkozas, mely jelen esetben a Megjelenites lesz
    //segit megteremteni az esemenyek kivant sorrendiseget, azaz, hogy az altala hivatkozott fuggveny az outer fuggveny "teendoinek" vegeztevel fusson csak le
    $.ajax({
      url: fajlnev,
      success: function (result) {
        console.log(result);
        result.lista.forEach((element) => {
          tomb.push(element); //pakolja be a tombbe a beolvasott json fileban levo lista elemeit
        });
        // console.log(tomb);

        //akkor kell meghivni a megjelenitest, ha mar betoltodott a file, ha mar nem ures a tomb; itt mar biztosan fel van toltve a tomb erteke adatokkal
        myCallback(tomb);
      },
    });
  }
});

/*HF: megjelenit metodus az osszerendelt tombot jelenitse. meg*/
