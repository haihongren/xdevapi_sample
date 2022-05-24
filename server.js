const newrelic = require("newrelic");
require("@newrelic/xdevapi");
var mysqlx = require('@mysql/xdevapi');

const dbConfig = require("./db.config.js");

var schema = DBConnection();
newrelic.startBackgroundTransaction("testTransaction1", DbOperation)

function DBConnection(schema) {
    console.log("DBConnection");
    const session = mysqlx.getSession({
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
    });

    var schema = session
        .then((session) => {
            console.log("Successfully connected to the database.");
            return session.getSchema(dbConfig.DB);
        })
        .catch((e) => {
            console.log("error message" + e);
        });
    return schema
}


async function DbOperation() {

    var myTable;

    myTable = await schema.then((s) => s.getTable("my_table"));

    for (let i = 1; i <= 5; i++) {
        myTable
            .insert(['name', 'birthday', 'age'])
            .values(['Laurie', '2000-5-27', 19 + i])
            .execute();

        myTable
            .select(['name', 'birthday'])
            .where('name like :name && age < :age')
            .bind('name', 'L%')
            .bind('age', 30)
            .execute().then(function (myResult) {
                console.log(myResult.fetchAll());
            });
        await mysleep(1500);
    }


    myTable
        .delete()
        .where('age > :age')
        .bind("age", 19)
        .execute();
}


async function mysleep(ms) {
    await sleep(ms);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


