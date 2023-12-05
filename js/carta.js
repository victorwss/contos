[...document.querySelectorAll(".baralho li")].forEach((carta, i) => {
    carta.onclick = () => {
        carta.classList.toggle("carta-selecionada");
    };
    carta.style["z-index"] = (i + 10) + "";
});