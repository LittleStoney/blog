const mysql = require('mysql')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'13579asd',
    database:'blogv2',
    port:'3306'
})
function query(sql,values){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection) => {
            if(err) reject(err)
            connection.query(sql,values,(err,rows) => {
                if(err) reject(err)
                resolve(rows)
                connection.release() //释放连接，否则会卡顿
            })
        })
    })
}

module.exports = query