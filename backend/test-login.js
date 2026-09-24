const axios = require('axios');
async function run() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@anandmayi.com',
            password: 'password123'
        });
        console.log(res.data);
    } catch(err) {
        console.log("Error:", err.response ? err.response.data : err.message);
    }
}
run();
