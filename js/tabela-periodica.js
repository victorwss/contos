function aufbau(numero) {
    // Número de elétrons a distribuir em níveis.
    let sobrando = numero;

    // Array com a configuração eletrônica que será construída, subnível por subnível.
    const configuracao = [];

    // Na regra de aufbau, costuma-se desenhar setas diagonais. Este laço simula essas setas.
    for (let seta = 0; sobrando > 0; seta++) {

        // E cada uma dessas setas percorre uma lista de subníveis.
        for (let nivel = Math.ceil(seta / 2); sobrando > 0 && nivel <= seta; nivel++) {

            // Calcula o número de elétrons de valência no subnível.
            const valencia = (seta - nivel) * 4 + 2;
            const eletronsNoSubnivel = Math.min(sobrando, valencia);

            // E coloca esses elétrons no nível correspondente, subtraindo do número de elétrons que falta distribuir.
            sobrando -= eletronsNoSubnivel;
            if (configuracao.length <= nivel) configuracao.push(0);
            configuracao[nivel] += eletronsNoSubnivel;
        }
    }
    return configuracao;
}

function eletrosfera(numero) {
    // Paládio e laurêncio são casos especiais únicos.
    if (numero ===  46) return [2, 8, 18, 18];
    if (numero === 103) return [2, 8, 18, 32, 32, 8, 3];

    // A maioria dos elementos deve seguir exatamente a regra de aufbau.
    // Os que fogem dela (exceto o paládio), haverá apenas um elétron no lugar errado, e isso será corrigido abaixo.
    const eletrons = aufbau(numero);

    // Casos especiais onde há um elétron do último nível que foi para o penúltimo (ex: molibdênio, prata, ouro).
    if ([24, 29, 41, 42, 44, 45, 47, 78, 79].includes(numero)) {
        eletrons[eletrons.length - 1]--;
        eletrons[eletrons.length - 2]++;
    }

    // Casos especiais onde há um elétron do antepenúltimo nível que foi para o penúltimo (ex: cério, gadolíneo, urânio).
    if ([57, 58, 64, 89, 90, 91, 92, 93, 96].includes(numero)) {
        eletrons[eletrons.length - 3]--;
        eletrons[eletrons.length - 2]++;
    }

    // Observação: Ninguém sabe ao certo quais são as exceções a partir do meitnério (109).
    // Então, na falta de informações melhores, assume-se que a regra de aufbau continuará valendo para eles.

    return eletrons;
}

class Elemento {
    constructor(numero, simboloNome) {
        const gasesNobres  = [2, 10, 18, 36, 54, 86, 118];
        const naoMetais    = [1, 6, 7, 8, 15, 16, 34];
        const semimetais   = [5, 14, 32, 33, 51, 52];
        const posTransicao = [13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116];

        const sn = simboloNome.split(" ");
        this.simbolo = sn[0];
        this.nome    = sn[1];
        this.numero  = numero;

        this.classe
                = (numero >= 109 && numero !== 112) ? "naosabe"
                : gasesNobres.includes(numero)      ? "gas-nobre"
                : naoMetais.includes(numero)        ? "nao-metal"
                : semimetais.includes(numero)       ? "semimetal"
                : posTransicao.includes(numero)     ? "postrans"
                : gasesNobres.includes(numero + 1)  ? "halogenio"
                : gasesNobres.includes(numero - 1)  ? "alcalino"
                : gasesNobres.includes(numero - 2)  ? "terroso"
                : numero >= 57 && numero <= 70      ? "lantanio"
                : numero >= 89 && numero <= 102     ? "actinio"
                :                                     "transicao";

        this.eletrosfera = eletrosfera(numero);
        this.eletrosferaDuvidosa = numero >= 109;
    }

    html() {
        let eletrons = [];
        for (let i of this.eletrosfera) {
            eletrons.push(`${i}`);
        }
        for (let i = this.eletrosfera.length; i < 7; i++) {
            eletrons.push("&nbsp;");
        }
        if (this.eletrosferaDuvidosa) eletrons[this.eletrosfera.length - 1] = "?" + eletrons[this.eletrosfera.length - 1];
        return `
            <td class="elemento ${this.classe}">
                <table>
                    <tr><td class="eletrons">${eletrons[0]}</td><td class="numero" rowspan="2">${this.numero}</td><td class="eletrons">${eletrons[0]}</td></tr>
                    <tr><td class="eletrons">${eletrons[1]}</td><td class="eletrons">${eletrons[1]}</td></tr>
                    <tr><td class="eletrons">${eletrons[2]}</td><td class="simbolo" rowspan="4">${this.simbolo}</td><td class="eletrons">${eletrons[2]}</td></tr>
                    <tr><td class="eletrons">${eletrons[3]}</td><td class="eletrons">${eletrons[3]}</td></tr>
                    <tr><td class="eletrons">${eletrons[4]}</td><td class="eletrons">${eletrons[4]}</td></tr>
                    <tr><td class="eletrons">${eletrons[5]}</td><td class="eletrons">${eletrons[5]}</td></tr>
                    <tr><td class="eletrons">${eletrons[6]}</td><td>&nbsp;</td><td class="eletrons">${eletrons[6]}</td></tr>
                    <tr><td colspan="3" class="nome">${this.nome}</td></tr>
                </table>
            </td>`;
    }
}

class Grupo {
    constructor(numero) {
        this.numero = numero;
    }

    html() {
        return `<th class="grupo" scope="col">Grupo<br>${this.numero}</td>`;
    }
}

class Periodo {
    constructor(numero) {
        this.numero = numero;
    }

    html() {
        return `<th class="periodo" scope="row">Período<br>${this.numero}</td>`;
    }
}

class Especial {
    constructor(texto) {
        this.texto = texto;
    }

    html() {
        return this.texto === "$1" ? `<td class="especial lantanio">Lanta- nídeos</td>`
                : this.texto === "$2" ? `<td class="especial actinio">Acti- nídeos</td>`
                : this.texto === "#1" ? `<th class="especial" scope="row">Lanta- nídeos</td>`
                : this.texto === "#2" ? `<th class="especial" scope="row">Acti- nídeos</td>`
                : this.texto === "#L" ? `<th class="especial" scope="row">Legenda</td>`
                : `<td class="especial">ERRO</td>`;
    }
}

class Legenda {
    constructor(chave) {
        const dict = {
            "A": ["alcalino" , "Metais<br>alcalinos"],
            "B": ["terroso"  , "Metais<br>alcalinos<br>terrosos"],
            "C": ["transicao", "Metais<br>de transição"],
            "D": ["postrans" , "Metais<br>pós-transição"],
            "E": ["semimetal", "Semimetais"],
            "F": ["nao-metal", "Não metais"],
            "G": ["halogenio", "Halogênios"],
            "H": ["gas-nobre", "Gases nobres"],
            "I": ["lantanio" , "Metais<br>lantanídeos"],
            "J": ["actinio"  , "Metais<br>actinídeos"],
            "K": ["naosabe"  , "Propriedades desconhecidas, duvidosas, incertas, disputadas e/ou inconclusivas"]
        };
        this.classe = dict[chave][0];
        this.legenda = dict[chave][1];
    }

    html() {
        return `<td class="${this.classe} legenda">${this.legenda}</td>`;
    }
}

class Vazio {
    html() {
        return `<td class="vazio">&nbsp;<br>&nbsp;<br>&nbsp;</td>`;
    }
}

const nomes = [null,
    "H Hidrogênio", "He Hélio",
    "Li Lítio", "Be Berílio", "B Boro", "C Carbono", "N Nitrogênio", "O Oxigênio", "F Flúor", "Ne Neônio",
    "Na Sódio", "Mg Magnésio", "Al Alumínio", "Si Silício", "P Fósforo", "S Enxofre", "Cl Cloro", "Ar Argônio",
    "K Potássio", "Ca Cálcio", "Sc Escândio", "Ti Titânio", "V Vanádio", "Cr Cromo", "Mn Manganês", "Fe Ferro", "Co Cobalto",
    "Ni Níquel", "Cu Cobre", "Zn Zinco", "Ga Gálio", "Ge Germânio", "As Arsênio", "Se Selênio", "Br Bromo", "Kr Criptônio",
    "Rb Rubídio", "Sr Estrôncio", "Y Ítrio", "Zr Zircônio", "Nb Nióbio", "Mo Molibdênio", "Tc Tecnécio", "Ru Rutênio", "Rh Ródio",
    "Pd Paládio", "Ag Prata", "Cd Cádmio", "In Índio", "Sn Estanho", "Sb Antimônio", "Te Telúrio", "I Iodo", "Xe Xenônio",
    "Cs Césio", "Ba Bário", "La Lantânio", "Ce Cério", "Pr Praseodímio", "Nd Neodímio", "Pm Promécio", "Sm Samário",
    "Eu Európio", "Gd Gadolíneo", "Tb Térbio", "Dy Disprósio", "Ho Hólmio", "Er Érbio", "Tm Túlio", "Yb Itérbio",
    "Lu Lutécio", "Hf Háfnio", "Ta Tântalo", "W Tungstênio", "Re Rênio", "Os Ósmio", "Ir Irídio", "Pt Platina",
    "Au Ouro", "Hg Mercúrio", "Tl Tálio", "Pb Chumbo", "Bi Bismuto", "Po Polônio", "At Astato", "Rn Radônio",
    "Fr Frâncio", "Ra Rádio", "Ac Actínio", "Th Tório", "Pa Protactínio", "U Urânio", "Np Neptúnio", "Pu Plutônio",
    "Am Amerício", "Cm Cúrio", "Bk Berquélio", "Cf Califórnio", "Es Einstênio", "Fm Férmio", "Md Mendelévio", "No Nobélio",
    "Lr Laurêncio", "Rf Ruterfódio", "Db Dúbnio", "Sg Seabórgio", "Bh Bóhrio", "Hs Hássio", "Mt Meitnério", "Ds Darmstádio",
    "Rg Roentgênio", "Cn Copernício", "Nh Nihônio", "Fl Fleróvio", "Mc Moscóvio", "Lv Livermório", "Ts Tenessino", "Og Oganessônio"
];

const elementosPorNumero = [null];
const elementosPorSimbolo = {};
for (let idx = 1; idx < nomes.length; idx++) {
    const nome = nomes[idx];
    const elemento = new Elemento(idx, nome);
    elementosPorNumero.push(elemento);
    elementosPorSimbolo[elemento.simbolo] = elemento;
}

const tabela = ""
        + "    1  2     3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 "
        + ">1 H                                                     He "
        + ">2 Li Be                                  B  C  N  O  F  Ne "
        + ">3 Na Mg                                  Al Si P  S  Cl Ar "
        + ">4 K  Ca    Sc Ti V  Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr "
        + ">5 Rb Sr    Y  Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I  Xe "
        + ">6 Cs Ba $1 Lu Hf Ta W  Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn "
        + ">7 Fr Ra $2 Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og "
        + "                                                            "
        + "      #1 La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb          "
        + "      #2 Ac Th Pa U  Np Pu Am Cm Bk Cf Es Fm Md No          "
        + "                                                            "
        + "      #L @A @B @C @D @E @F @G @H @I @J @K                   ";

const vazio = new Vazio();

// Começa a construir a tabela.
let htmlTabela = "<table>";

// Cada célula na string tabela tem 3 caracteres, então percorre os caracteres da string de 3 em 3.
for (let i = 0; i < tabela.length / 3; i++) {
    // Se estiver começando uma linha, põe o <tr>. Cada linha tem 20 colunas
    if (i % 20 === 0) htmlTabela += "<tr>";

    // Separa os 2 caracteres desta célula a partir da string.
    // O terceiro caractere é sempre um espaço e portanto não é relevante.
    const nome = tabela.substring(i * 3, i * 3 + 2).trim();

    // Instancia um objeto que represente a célula conforme os dois caracteres lidos.
    const objeto = nome === "" ? vazio
            : nome in elementosPorSimbolo ? elementosPorSimbolo[nome]
            : "" + parseInt(nome) === nome ? new Grupo(nome)
            : nome.startsWith(">") ? new Periodo(nome.substring(1))
            : nome.startsWith("@") ? new Legenda(nome.substring(1))
            : new Especial(nome);

    // Converte esse objeto no HTML de um <td> ou <th> e o coloca no HTML da tabela como um todo.
    htmlTabela += objeto.html();

    // Se estiver terminando uma linha, põe o </tr>.
    if (i % 20 === 19) htmlTabela += "</tr>";
}

// Finaliza a tabela.
htmlTabela += "</table>";

document.querySelectorAll("div.tabela-periodica").forEach(d => d.innerHTML = htmlTabela);