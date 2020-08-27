const { set } = require("mongoose")

const add = (num1, num2) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
                // if(num2 > 2) {
                //     reject(new Error('Error in add'))

                // }
                resolve(num1 + num2);
            })
    })
}

const doWork = async () => {
    let sum = await add(1, 2);
    sum = await add(sum, 3);
    return sum;
}

doWork().then(console.log).catch(console.log)

