const express = require('express');
const router = express.Router();
 
router.get('/', (req, res) => {
    res.send(`<html>
<body>
<h1>Message Board</h1>
 
<h3>Register</h3>
<form id="regForm">
<p>Username: <input type="text" id="regUser">
<p>Password: <input type="password" id="regPass">
<p><input type="button" value="Register" onclick="doRegister()">
</form>
<p id="regResult"></p>
 
<hr>
 
<h3>Login</h3>
<form id="loginForm">
<p>Username: <input type="text" id="loginUser">
<p>Password: <input type="password" id="loginPass">
<p><input type="button" value="Login" onclick="doLogin()">
</form>
<p id="loginResult"></p>
 
<hr>
 
<h3>Dashboard</h3>
<p><input type="button" value="Load Dashboard" onclick="loadDashboard()">
<input type="button" value="Logout" onclick="doLogout()">
<div id="dashResult"></div>
 
<script>
function doRegister() {
    fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('regUser').value,
            password: document.getElementById('regPass').value
        })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('regResult').innerText = data.message || data.error;
    });
}
 
function doLogin() {
    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('loginUser').value,
            password: document.getElementById('loginPass').value
        })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('loginResult').innerText = data.message || data.error;
    });
}
 
function loadDashboard() {
    fetch('/dashboard')
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            document.getElementById('dashResult').innerText = data.error;
            return;
        }
        var html = '<p>Logged in as: ' + data.username + '</p>';
        if (data.subscribedTopics.length === 0) {
            html += '<p>No subscribed topics yet.</p>';
        }
        for (var i = 0; i < data.subscribedTopics.length; i++) {
            var t = data.subscribedTopics[i];
            html += '<p><b>' + t.title + '</b></p>';
            for (var j = 0; j < t.recentMessages.length; j++) {
                var m = t.recentMessages[j];
                html += '<p> - ' + m.author.username + ': ' + m.content + '</p>';
            }
        }
        if (data.availableTopics.length > 0) {
            html += '<p><b>Available to subscribe:</b></p>';
            for (var k = 0; k < data.availableTopics.length; k++) {
                html += '<p>' + data.availableTopics[k].title + '</p>';
            }
        }
        document.getElementById('dashResult').innerHTML = html;
    });
}
 
function doLogout() {
    fetch('/auth/logout', { method: 'POST' })
    .then(r => r.json())
    .then(data => {
        document.getElementById('dashResult').innerText = data.message;
    });
}
</script>
</body>
</html>`);
});
 
module.exports = router;