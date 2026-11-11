

var idp = 1;

async function buscarPais() {

    var nomePais = document.getElementById("ipais")

    if (nomePais.value.trim() === ""){
        alert("Digite um país ou seu codigo de dois digitos")
        return
    }

    try {

        
        var pais = await ListaPais(nomePais.value)

        let resposta = await fetch(`https://flagdex.net/api/v1/country/${pais}.json`);

        if(!resposta.ok) {
            throw new Error("Erro ao encontrar o país")
        }

        var dado = await resposta.json()

        var divpaises = document.getElementById("paises")

        var existe = [...divpaises.children].some(div => {
            return div.querySelector("h2").textContent === dado.name;
        });

        if (existe) {
            alert("Este país já foi pesquisado!");
            return;
        }

        var div = document.createElement("div")
        div.className = "pdiv"
        div.dataset.id = idp

        var nome = document.createElement("h2")
        nome.innerHTML = `${dado.name}`

        var capital = document.createElement("p")
        capital.innerHTML = `Capital: ${dado.capital[0]}`

        var regiao = document.createElement("p")
        regiao.innerHTML = `Região: ${dado.region}`

        var populacao = document.createElement("p")
        populacao.innerHTML = `População: ${dado.population}`

        var botao = document.createElement("button")
        botao.innerHTML = "📌"
        botao.className = "btn-pin"

        div.appendChild(nome)
        div.appendChild(capital)
        div.appendChild(regiao)
        div.appendChild(populacao)
        div.appendChild(botao)
        
        divpaises.appendChild(div)

        botao.addEventListener("click", function(event){
            pin(event, nome, capital, populacao, regiao, idp)
        })

        idp++
        console.log(dado)

        
    } catch (error) {
        alert("Error, Country not found!")
        console.log("Error:", error)
    }
}

async function ListaPais(country) {
    try {
        var resposta = await fetch("https://flagdex.net/api/v1/countries.json")
                
            if(!resposta.ok) {
                throw new Error("Erro ao encontrar o país")
            }

        var dado = await resposta.json()

        let paises = dado.countries;

        let posicao = paises.findIndex(function(pais){
            return pais.name.toLowerCase() === country.toLowerCase() ||
                   pais.iso2.toLowerCase() === country.toLowerCase() ||
                   pais.altSpellings.some(function(nome) {
                        return nome.toLowerCase() === country.toLowerCase();
                    }); 
            
        })

        if (posicao === -1) {
            throw new Error("País não encontrado")
        }

        country = paises[posicao].iso2
        
        return country.toLowerCase()
        

    } catch (error) {
        throw error;
    }
}

function pin(event, nome, capital, populacao, regiao, id) {
    if (event.target.style.backgroundColor !== "black") {
        event.target.style.backgroundColor = "black"
        var guardar = JSON.parse(localStorage.getItem("conteudo")) || []
        guardar.push({
            "id": id,
            "nome": nome.textContent,
            "capital": capital.textContent,
            "populacao": populacao.textContent,
            "regiao": regiao.textContent
        })
        localStorage.setItem("conteudo", JSON.stringify(guardar))

    }else {
        event.target.style.backgroundColor = "white"
        var guardar = JSON.parse(localStorage.getItem("conteudo")) || []
        var pai = event.target.parentElement

        let posicao = guardar.findIndex(dado => {
            return dado.id === Number(pai.dataset.id)
        })

        if(posicao === -1) {
            return
        }

        guardar.splice(posicao, 1)

        localStorage.setItem("conteudo", JSON.stringify(guardar))

    }
}

window.onload = function() {
    dados = JSON.parse(localStorage.getItem("conteudo")) || []
    var divpaises = document.getElementById("paises")
    var idatual = 0

    dados.forEach(dado => { 

        var div = document.createElement("div")
        div.className = "pdiv"
        div.dataset.id = dado.id
        

        var nome = document.createElement("h2")
        nome.innerHTML = `${dado.nome}`

        var capital = document.createElement("p")
        capital.innerHTML = `Capital: ${dado.capital}`

        var regiao = document.createElement("p")
        regiao.innerHTML = `Região: ${dado.regiao}`

        var populacao = document.createElement("p")
        populacao.innerHTML = `População: ${dado.populacao}`

        var botao = document.createElement("button")
        botao.innerHTML = "📌"
        botao.className = "btn-pin"
        botao.style.backgroundColor = "black";

        div.appendChild(nome)
        div.appendChild(capital)
        div.appendChild(regiao)
        div.appendChild(populacao)
        div.appendChild(botao)
        
        divpaises.appendChild(div)

        botao.addEventListener("click", function(event){
            pin(event, nome, capital, populacao, regiao, dado.id)
        })

        if (dado.id > idatual) {
            idatual = dado.id
        }

    })
    idp = idatual + 1
}

