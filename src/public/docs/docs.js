// INICIALIZAÇÃO DO SWAGGER
const ui = SwaggerUIBundle({
    url: "/swagger.json", // Certifique-se de que o caminho do seu JSON está correto
    dom_id: "#swagger-ui",
    deepLinking: true,
    docExpansion: "list", // "none", "list" ou "full"
    defaultModelsExpandDepth: 1
});

// LÓGICA DO TEMA (Com persistência no LocalStorage)
const toggle = document.getElementById("toggleTheme");
const currentTheme = localStorage.getItem("theme");

// Verifica o tema salvo anteriormente
if (currentTheme === "dark") {
    document.body.classList.add("dark");
}

toggle.onclick = () => {
    document.body.classList.toggle("dark");
    
    // Salva a preferência do usuário
    let theme = "light";
    if (document.body.classList.contains("dark")) {
        theme = "dark";
    }
    localStorage.setItem("theme", theme);
};

// BUSCA NOS ENDPOINTS
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    
    // O Swagger carrega elementos dinamicamente, então buscamos toda vez
    const blocks = document.querySelectorAll(".opblock");

    blocks.forEach(block => {
        // Busca texto tanto no path da rota quanto na descrição
        const pathText = block.querySelector('.opblock-summary-path')?.innerText.toLowerCase() || "";
        const descText = block.querySelector('.opblock-summary-description')?.innerText.toLowerCase() || "";
        
        if (pathText.includes(value) || descText.includes(value)) {
            block.style.display = "block";
        } else {
            block.style.display = "none";
        }
    });
});