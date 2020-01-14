const mysql = require('mysql')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'13579asd',
    database:'blog',
    port:'3306'
})
function query(sql,values){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection) => {
            if(err) reject(err)
            connection.query(sql,values,(err,rows) => {
                if(err) reject(err)
                resolve(rows)
                connection.release()
            })
        })
    })
}

module.exports = query