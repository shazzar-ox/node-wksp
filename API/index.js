const http = require("node:http");

const fs = require("node:fs");
const { title } = require("node:process");

const DB = fs.readFileSync("./db/index.json", "utf-8");

const server = http.createServer((req, res) => {
  const { url, method } = req;

  //   GET http://localhost:5000/books
  if (url === "/books" && method === "GET") {
    // set header
    res.writeHead(200, { "Content-Type": "text/palin" });

    // send a body

    const books = JSON.parse(DB);

    const response = { status: 200, message: "OK", data: { books } };

    res.write(JSON.stringify(response), (err) => {
      if (err) throw err;
    });

    console.log(DB);
    res.end();
  }

  //   GET http://localhost:5000/books/id

  if (url && method === "GET") {
    const params = url.split("/");
    const paramId = params[params.length - 1].trim();
    res.writeHead(200, { "Content-Type": "text/palin" });

    const books = JSON.parse(DB);
    const book = books.find((el) => {
      if (el.id === +paramId) {
        return el;
      }
    });

    if (book === undefined) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Book Not Found");
    }

    const response = { status: 200, message: "OK", data: { book } };
    res.write(JSON.stringify(response));
    console.log(book);
    res.end();
  }


  //   UPDATE http://localhost:5000/books/id

  if (url && method === "PATCH") {
    const params = url.split("/");
    const paramId = params[params.length - 1].trim();
    res.writeHead(200, { "Content-Type": "application/json" });

    const books = JSON.parse(DB);
    let data = ''
    req.on('data', files => {
      data += files

    })

    req.on('end', () => {
      const book = books.map((el) => {
        if (el.id === +paramId) {
          data = JSON.parse(data)
          el.title = data.title
          el.pages = data.pages
          el.publishedYear = data.publishedYear
          el.price = data.price
          el.quantity = data.quantity

          console.log(books)
          const changeData = fs.writeFileSync('./db/index.json', JSON.stringify(books, null, 2))
          // data = files.toString()

        }
      });
      // res.write
      const response = { status: 200, message: 'Uploaded', data: { data } }
      res.write(JSON.stringify(response))
      res.end()
    })







    // if (book === undefined) {
    //   res.writeHead(404, { "Content-Type": "text/plain" });
    //   res.end("Book Not Found");
    // }

    // const response = { status: 200, message: "OK", data: { book } };
    // res.write(JSON.stringify(response));
    // console.log(book);
    // res.end();
  }
  //  DELETE http://localhost:5000/books/id

  if (url && method === "DELETE") {
    console.log('hi')
    const params = url.split("/");
    const paramId = params[params.length - 1].trim();
    res.writeHead(200, { "Content-Type": "application/json" });

    const books = JSON.parse(DB);
    let data = ''

    req.on('data', files => {
      data += files.toString()

    })

    req.on('end', () => {

      const book = books.filter((el) => el.id !== +paramId);

      const changeData = fs.writeFileSync('./db/index.json', JSON.stringify(book, null, 2))
      data = JSON.parse(data)
      // res.write
      const response = { status: 200, message: 'Data succesfully deleted', data: { data } }
      res.write(JSON.stringify(response))
      res.end()
    })
  }
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});

// bookstore

// add a book
// delete a book
// update a book
// read book/books
