## Minha primeira aplicação front-end

Pequeno projeto para implementação do MVP da disciplina **Desenvolvimento Full Stack Avançado** 

O objetivo é apresentar um pequeno front-end utilizando as tecnologias HTML, CSS e JavaScript.

Não é preciso instalar nada se não for utilizar com o docker. Para executá-la, basta acessar o arquivo index.html na raiz do projeto.

---

## Executando através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal. Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t basic_front_app .
```

Uma vez criada a imagem, para executar o container basta rodar o seguinte comando **como administrador** :

```
$ docker run -d -p 8081:80 --name basic_front_container basic_front_app
```

Uma vez executando, para acessar a pequena aplicação, basta abrir o [http://localhost:8081](http://localhost:8081) no navegador.
