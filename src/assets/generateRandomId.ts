//create a function that generates a random id with a lenght of 6 characters numerics and alphabetics

export const generateRandomId = () => {
    let id = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
};
