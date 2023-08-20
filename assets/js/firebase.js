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
                location.href = "login.html"
            }).catch((err) => {
                alert(err.message);
            });

        };
    });
}


function logIn() {

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const passwordError = document.getElementById('password-error');

        if (email && password) {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    passwordError.textContent = "";
                    const queryParams = new URLSearchParams(window.location.search);
                    location.href = queryParams.get("next") ? queryParams.get("next") : "home.html";
                })
                .catch((error) => {
                    passwordError.textContent = `${error.message}`;
                });
        };
    });
};

function logOut() {
    firebase.auth().signOut().then(() => {
        location.href = "home.html";
    }).catch((error) => {
        console.log(error);
    });
}

function checkAuth(role) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.href = `login.html?next=${window.location.pathname}`;
        }
        autoFillUser(user);
        firebase.firestore().collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.role != role) {
                    location.href = "404.html";
                }
            }
        });
    });
};

function submitDetails() {

    const applyForm = document.getElementById('apply-form');
    applyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputElements = applyForm.querySelectorAll("input");

        const uid = document.getElementById('uid').value;

        const inputValues = { date: currentDate() };

        inputElements.forEach((input) => {
            inputValues[input.name] = input.value;
        });

        //console.log({ date: currentDate(), ...inputNames });

        firebase.firestore().collection("student-details").doc(uid).set(
            inputValues
        )
    })

}

function autoFillUser(user) {
    const form = document.getElementById("apply-form");

    if (form) {
        const emailInput = document.getElementById("email");

        if (emailInput) {
            emailInput.value = user.email;
        }

        const uidInput = document.getElementById("uid");
        if (uidInput) {
            uidInput.value = user.uid;
        }
    }

}

function currentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
}