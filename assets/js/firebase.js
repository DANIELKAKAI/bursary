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

let uid = "";

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
                    //const queryParams = new URLSearchParams(window.location.search);
                    //location.href = queryParams.get("next") ? queryParams.get("next") : "home.html";
                    location.href = "applications.html";
                })
                .catch((error) => {
                    passwordError.textContent = `${error.message}`;
                });
        };
    });
};

function logOut() {
    firebase.auth().signOut().then(() => {
        uid = "";
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
        uid = user.uid;
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

        const inputElements = applyForm.querySelectorAll("input, select");

        const uid = document.getElementById('uid').value;

        const inputValues = { date: currentDate(), status: "Not Seen" };

        inputElements.forEach((input) => {
            inputValues[input.name] = input.value;
        });

        firebase.firestore().collection("student-details").doc(uid).set(
            inputValues
        ).then(() => {
            location.href = "uploads.html"
        })
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


// file uploads
function submitUploads() {
    upLoadFiles();

    const applyForm = document.getElementById('apply-form');

    applyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const requiredInputs = applyForm.querySelectorAll('input[required]');

        let valid = true;

        requiredInputs.forEach(input => {
            if (!input.classList.contains('green-highlight')) {
                valid = false;
                alert("Select All the required Files");
                return;
            }
        });
        if (valid) {
            location.href = "applications.html";
        }
    });
}

function upLoadFiles() {
    const fileInputs = document.querySelectorAll('.form-control');

    fileInputs.forEach(fileInput => {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                upLoadFile(fileInput);
            } else {
                fileInput.classList.remove('green-highlight');
            }
        });
    });
}

function upLoadFile(fileInput) {
    for (var i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileName = fileInput.name + getFileExtension(file.name);
        const filePath = `users/students/${uid}/${fileName}`;
        console.log(filePath);

        firebase.storage().ref(filePath).put(file).then(
            (snapshot) => {
                fileInput.blur();
                fileInput.classList.add('green-highlight');
            }
        ).catch((error) => {
            console.log(error);
        });
    }
}

// applications

function fetchApplications() {
    let tableBody = document.getElementById("applications");
    let name = document.getElementById("fullName");
    let content = "";
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.href = `login.html?next=${window.location.pathname}`;
        }
        firebase.firestore().collection("student-details").where('uid', '==', user.uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                name.innerHTML = doc.data().first_name + " " + doc.data().middle_name + " " + doc.data().last_name;

                content += `<tr>
                        <th scope="row">4535TR</th>
                        <td>${doc.data().date}</td>
                        <td>
                          ${getStatusIcon(doc.data().status)}
                        </td >
                        <td>
                        <a href="apply.html?${uid}">Edit</a>
                        </td>
                      </tr > `;
            });
            tableBody.innerHTML = content;
        });
    })
}

function fetchAllApplications() {
    let tableBody = document.getElementById("applications");
    let content = "";
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.href = `login.html?next=${window.location.pathname}`;
        }
        firebase.firestore().collection("student-details").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const fullName = doc.data().first_name + " " + doc.data().middle_name + " " + doc.data().last_name;

                content += `<tr>
                        <td>APP73828</td>
                        <td>${doc.data()['id-card-number']}</td>
                        <td>${doc.data()['birth-certificate-number']}</td>
                        <td class="text-capitalize">${fullName}</td>
                        <td>${doc.data().date}</td>
                        <td>
                          ${getStatusIcon(doc.data().status)}
                        </td>
                        <td>
                        <a href="student.html?uid=${doc.data().uid}">View Profile</a>
                        </td>
                      </tr> `;
            });
            tableBody.innerHTML = content;
        });
    });

    let search = document.getElementById("search");
    search.addEventListener("input", (event) => {
        let value = event.target.value;
        searchStudents(value);
    });
}

function searchStudents(searchTerm) {
    let tableBody = document.getElementById("applications");
    let content = "";

    firebase.firestore().collection("student-details")
        .orderBy("first_name")
        .startAt(searchTerm)
        .endAt(searchTerm + "\uf8ff")
        .get()
        .then((querySnapshot) => {
            tableBody.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const fullName = doc.data().first_name + " " + doc.data().middle_name + " " + doc.data().last_name;
                content += `<tr>
                        <td>APP73828</td>
                        <td>${doc.data()['id-card-number']}</td>
                        <td>${doc.data()['birth-certificate-number']}</td>
                        <td class="text-capitalize">${fullName}</td>
                        <td>${doc.data().date}</td>
                        <td>
                          ${getStatusIcon(doc.data().status)}
                        </td>
                        <td>
                        <a href="student.html?uid=${doc.data().uid}">View Profile</a>
                        </td>
                      </tr> `;
            });
            tableBody.innerHTML = content;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// student page
function fetchStudent() {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    const img = document.getElementById('passport');

    searchFileByName('passport', uid).then((file) => {
        file.getDownloadURL().then(url => img.src = url);
    });

    firebase.firestore().collection("student-details").where('uid', '==', uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            for (const key in doc.data()) {
                let td = document.getElementById(key);
                if (td) {
                    td.innerHTML = doc.data()[key];
                }
            }
        });
    });
}

function searchFileByName(fileName, uid) {
    return firebase.storage().ref(`users/students/${uid}/`).listAll()
        .then((res) => {
            const file = res.items.find(item => item.name.includes(fileName));
            return file || null;
        });
}

function downLoadStudentFiles() {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');

    firebase.storage().ref(`users/students/${uid}/`).listAll()
        .then((res) => {
            res.items.forEach((file) => {
                file.getDownloadURL().then(url => {
                    var link = document.createElement('a');
                    link.href = url;
                    link.target = "_blank"
                    link.download = file.name;
                    link.click();
                });
            })
        });
}

function changeStatus(button, status) {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    firebase.firestore().collection("student-details").doc(uid).update(
        { status: status }
    ).then(() => {
        let buttons = document.getElementsByClassName("status-btn");
        Array.from(buttons).forEach((btn) => {
            btn.disabled = false;
        });
        button.disabled = true;
    })
}


// utils
function currentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 2 >>> 0) + 2);
}

function getStatusIcon(status) {
    if (status == "Not Seen") {
        return '<i class="bi bi-hourglass-top text-secondary"></i> Not Seen'
    }
    if (status == "Approved") {
        return '<i class="bi bi-check-circle-fill text-success"></i> Approved'
    }
    if (status == "Rejected") {
        return '<i class="bi bi-exclamation-circle-fill text-danger"></i> Rejected'
    }
    if (status == "Seen") {
        return '<i class="bi bi-eye text-primary"></i> Seen'
    }
};
