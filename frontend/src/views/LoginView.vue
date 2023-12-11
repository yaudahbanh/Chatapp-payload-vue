<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Email:</label>
                <input id="username" v-model="email" type="text" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input id="password" v-model="password" type="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try {
                const req = await fetch('http://localhost:1335/api/members/login', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password 
                    }),
                })
                const data = await req.json()
                console.log(data);

                if (req.status !== 200) {
                    alert('Error logging in');
                } else if (req.status === 200){
                    alert('Logged in');
                    this.$router.replace('/dashboard');
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
};
</script>
