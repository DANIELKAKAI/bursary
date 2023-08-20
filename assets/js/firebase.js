const firebaseConfig = {
    apiKey: "AIzaSyDII-m9lKaLETQ0MnNVbQ60nNSg3okU3as",
    authDomain: "ijara-29578.firebaseapp.com",
    projectId: "ijara-29578",
    storageBucket: "ijara-29578.appspot.com",
    messagingSenderId: "179836127904",
    appId: "1:179836127904:web:6211cd64f39f34736b57c5",
    measurementId: "G-VFZSNLC811"
};

firebase.initializeApp(firebaseConfig);

function register() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const password2 = registerForm.password2.value;

        if (email && password && password2) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                console.log(userCredential);
                const uid = userCredential.user.uid;
                const role = "student";
                firebase.firestore().collection("users").doc(uid).set({
                    uid,
                    email,
                    role
                });
                console.log("Register Success");
            }).catch((err) => {
                alert(err.message);
            });

        };
    });
}


const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const passwordError = document.getElementById('password-error');

password2Input.addEventListener('input', () => {
    const password = passwordInput.value;
    const password2 = password2Input.value;

    if (password === password2) {
        passwordError.textContent = '';
    } else {
        passwordError.textContent = "Passwords don't match";
    }
});

