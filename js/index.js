// En este array guardamos los objetos con los datos de los videos a reproducir
const videos = [];
// En esta variable guardamos los puntos obtenidos
let points = 0;
// En estas variables guardamos los datos del usuario
let userName;
let userSurname
let userAge;


// Disparamos el modal inicial para pedir sus datos al usuario
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('#modalInicio').style.display='block';
});

// Guardamos los datos ingresados por el usuario al presionar el botón Registro
document.querySelector('#btnRegistro').addEventListener("click", (e) => {
  e.preventDefault();
  let name = document.querySelector('[name="nombre"]').value;
  let surname = document.querySelector('[name="apellido"]').value;
  let age = document.querySelector('[name="edad"]').value;
  userName = name;
  userSurname = surname;
  userAge = age;
  name = "";
  surname = "";
  age = "";
  document.querySelector('#modalInicio').style.display='none';
})

// SweetAlert para obtener los datos del usuario
/* document.addEventListener("DOMContentLoaded", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Datos del Usuario",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Apellido">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Edad">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
      ];
    },
  });
  user = formValues;
}); */

// Creamos los objetos de los 25 videos originales
for (let i = 1; i <= 25; i++) {
  const element = { id: i, src: `./videos/${i}.mp4`, repeated: false };
  videos.push(element);
}

// Creamos los objetos de los 5 videos repetidos seleccionados de forma aleatoria
const randomIndexes = [];

while (randomIndexes.length < 5) {
  let ranIndex = Math.floor(Math.random() * 25);
  if (!randomIndexes.includes(ranIndex)) {
    videos[ranIndex].repeated = true;  // Marcamos el video como repetido
    videos[ranIndex].detected = false; // Agregamos la propiedad detected
    let newVideo = videos[ranIndex];   // Hacemos la copia
    videos.push(newVideo);
    randomIndexes.push(ranIndex);
  }
}

// Aplicamos el algoritmo de Fisher-Yates para ordenar aleatoriamente el array de videos

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

shuffleArray(videos);
console.log(videos);

// Reproductor de videos

let videoCount = 1;
const display = document.querySelector("#display");

const playTest = () => {
  console.log("Reproduciendo")
  

  display.setAttribute("src", videos[0].src);
  display.muted = true;
  display.load();
  display.play();

  
}

display.addEventListener("ended", () => {
  if (videoCount < videos.length) {
    display.setAttribute("src", videos[videoCount].src);
    display.load();
    display.play();
    videoCount++;
  } else {
    document.querySelector('#points').textContent = `${points}/5`;
    document.querySelector('#modalFinal').style.display='block';
  }
});

const btnComenzar = document.querySelector('#btnComenzar');
btnComenzar.addEventListener("click", () => {
  playTest();
  btnComenzar.classList.add("w3-disabled");  // Deshabilitamos el botón de inicio
  btnComenzar.blur();  // Esta línea quita el foco del botón luego del click evitando que la barra espaciadora dispare el click
});


// Agregamos la funcionalidad de la barra espaciadora
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    // Extraemos el nombre numérico del video que se está reproduciendo
    let srcSplited = display.currentSrc.split("videos/");
    let file = srcSplited[1].split(".");
    let number = file[0];

    // Buscamos su ubicación correspondiente en el array de videos
    let index = videos.findIndex((item) => item.id == number);

    // Evaluamos si el video está repetido o no
    if (videos[index].repeated) {
      if (!videos[index].detected) {   // Esta comprobación extra evita sumar
        points++;                      // más de un punto por acierto
        videos[index].detected = true; // Marcamos el video como detectado
        alertify.notify('Correcto!!', 'success', 2);
      }
    } else {
      alertify.notify('Incorrecto', 'error', 2);
    }
  }
});
