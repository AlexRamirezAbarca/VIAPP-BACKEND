export const randomCharacters = (option: "num" | "alpha",lengthPass: number = 6) => {
    try {
        var pwdChars = (option === 'num') ? "0123456789" : "0123456789ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz";
        var pwdLen = lengthPass;
        var randPassword = Array(pwdLen).fill(pwdChars).map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        return randPassword;
    } catch (error) {
        return "q0_1234_ab2q"
    }
}
