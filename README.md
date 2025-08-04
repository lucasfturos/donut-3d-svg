# Donut 3D SVG

Projeto para renderizar uma rosquinha 3D animada em SVG usando Next.js, com cálculo da geometria no backend e animação no frontend.

---

## Descrição

Este projeto gera um torus (rosquinha) 3D via SVG, utilizando cálculo matemático para criar a geometria e projeção em 2D. A renderização ocorre no backend via API em Next.js, que retorna o SVG gerado dinamicamente com base na rotação fornecida. O frontend busca o SVG atualizado para criar uma animação suave.

---

## Tecnologias utilizadas

-   Next.js (React)
-   JavaScript (ES6+)
-   SVG para renderização vetorial
-   Matemática 3D para geração e projeção do torus

---

## Funcionamento

Este projeto gera uma rosquinha 3D (torus) em SVG usando uma API Next.js.

-   A API está em `/api/donut` e retorna um SVG do torus renderizado.
-   A rotação da rosquinha é controlada pelos parâmetros de query `rx`, `ry` e `rz` (ângulos em radianos para os eixos X, Y e Z).
-   A geometria do torus é gerada numericamente no backend, incluindo vértices e índices.
-   O SVG é composto por polígonos que representam os triângulos da malha, com sombreamento baseado na profundidade (`z`) para dar efeito 3D.
-   Para animar a rotação, basta fazer requisições periódicas à API com ângulos atualizados.

Exemplo de chamada:

```
/api/donut?rx=0.1&ry=0.2&rz=0.3
```

Retorna o SVG da rosquinha rotacionada com esses valores.

---

## Como executar localmente

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd donut-3d-svg
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

4. Acesse no navegador:

```
http://localhost:3000/api/donut
```
