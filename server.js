const express = require('express')
const app = express()

app.use(express.static('./public'))
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup HBS
app.set('view engine', 'hbs') 

// DB
const { dbConfig } = require('./.env')
const Pool = require('pg').Pool
const db = new Pool(dbConfig)

app.get('/', async (req, res) => {

    try{
        const { rows } = await db.query(`
            SELECT * FROM donors
        `)
        
        res.render('index', { donors: rows })
    } catch(err) {
        return res.status(500).send('Erro no servidor de banco de dados!')
    }

})

app.post('/donors', async (req, res) => {
    const { name, email, blood } = req.body
    
    if(name === '' || email === '' || blood === '') {
        return res.status(400).send('Todos os campos são obrigatórios')
    } else {

    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)
    ` 

    try {
        await db.query(query, [name, email, blood])
        
        res.redirect('/')
    } catch(err) {
        return res.status(500).send('Erro no banco de dados!')

    }
    
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))  
    